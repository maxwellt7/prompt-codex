import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import pdf from 'pdf-parse';
import { Prompt } from '../prompts/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../../data');
const OUTPUT_FILE = path.resolve(__dirname, '../prompts/allPrompts.json');

interface RawPrompt {
  title: string;
  description: string;
  systemPrompt: string;
  source: string;
  pageNumber?: number;
}

// Source to category mapping based on Codex themes
const SOURCE_CATEGORIES: Record<string, string[]> = {
  'Codex 1': ['foundational', 'specialized', 'strategic'],
  'Codex 2': ['strategic', 'specialized', 'metacognitive'],
  'Codex 3': ['cognitive', 'transformational'],
  'Codex 4': ['agentic', 'transformational', 'metacognitive'],
};

// Keywords for category detection
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  foundational: ['basic', 'introduction', 'fundamentals', 'getting started', 'beginner', 'core', 'foundation'],
  strategic: ['strategy', 'business', 'planning', 'decision', 'analysis', 'market', 'investment', 'advisor', 'consultant', 'planner', 'manager'],
  specialized: ['expert', 'specialist', 'professional', 'technical', 'domain', 'medical', 'legal', 'scientific', 'engineer'],
  cognitive: ['thinking', 'reasoning', 'philosophy', 'analysis', 'cognitive', 'mental', 'intellectual', 'problem-solving', 'critical'],
  transformational: ['growth', 'change', 'transform', 'mindfulness', 'wellness', 'healing', 'personal development', 'coach', 'therapy', 'inner child', 'shadow work'],
  agentic: ['persona', 'character', 'archetype', 'oracle', 'trickster', 'warrior', 'healer', 'mystic', 'rebel', 'sovereign'],
  metacognitive: ['prompt', 'meta', 'self-aware', 'reflection', 'learning', 'instruction', 'system'],
};

// Tag keywords for auto-tagging
const TAG_KEYWORDS: Record<string, string[]> = {
  health: ['health', 'medical', 'nutrition', 'diet', 'wellness', 'fitness', 'exercise'],
  finance: ['finance', 'investment', 'money', 'budget', 'trading', 'stocks', 'wealth'],
  business: ['business', 'startup', 'entrepreneur', 'company', 'corporate', 'management'],
  technology: ['technology', 'software', 'code', 'programming', 'AI', 'data', 'cloud', 'aws'],
  creativity: ['creative', 'writing', 'art', 'design', 'music', 'story', 'content'],
  productivity: ['productivity', 'efficiency', 'workflow', 'organization', 'time management'],
  education: ['education', 'learning', 'teaching', 'student', 'academic', 'research'],
  career: ['career', 'job', 'resume', 'interview', 'professional', 'work'],
  coaching: ['coach', 'mentor', 'guide', 'advice', 'support', 'counseling'],
  mindfulness: ['mindfulness', 'meditation', 'calm', 'peace', 'presence', 'awareness'],
  communication: ['communication', 'writing', 'speaking', 'presentation', 'email'],
  travel: ['travel', 'trip', 'vacation', 'destination', 'journey'],
  entertainment: ['entertainment', 'game', 'fun', 'sports', 'movie', 'music'],
  therapy: ['therapy', 'healing', 'emotional', 'trauma', 'mental health', 'psychology'],
  philosophy: ['philosophy', 'existential', 'meaning', 'wisdom', 'ethics'],
  leadership: ['leadership', 'management', 'team', 'lead', 'director'],
};

// Clean text from PDF artifacts
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\d+\s*\|\s*P\s*a\s*g\s*e/gi, '') // Remove page numbers like "16 | Page"
    .replace(/Page\s*\d+/gi, '')
    .replace(/[^\x20-\x7E\n\u2018\u2019\u201C\u201D\u2013\u2014]/g, ' ') // Keep basic ASCII + smart quotes
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate URL-friendly ID from title
function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

// Detect category based on content and source
function detectCategory(title: string, description: string, systemPrompt: string, source: string): string {
  const fullText = `${title} ${description} ${systemPrompt}`.toLowerCase();
  
  // Check each category's keywords
  let bestMatch = { category: 'specialized', score: 0 };
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }
  
  // If no strong match, use source-based default
  if (bestMatch.score < 2) {
    const sourceNum = source.match(/\d+/)?.[0] || '1';
    const defaults: Record<string, string> = {
      '1': 'foundational',
      '2': 'strategic',
      '3': 'cognitive',
      '4': 'agentic',
    };
    return defaults[sourceNum] || 'specialized';
  }
  
  return bestMatch.category;
}

// Detect tags based on content
function detectTags(title: string, description: string, systemPrompt: string): string[] {
  const fullText = `${title} ${description} ${systemPrompt}`.toLowerCase();
  const tags: string[] = [];
  
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    for (const keyword of keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        tags.push(tag);
        break;
      }
    }
  }
  
  // Ensure at least one tag
  if (tags.length === 0) {
    tags.push('general');
  }
  
  return [...new Set(tags)].slice(0, 5); // Max 5 tags
}

// Extract prompts using multiple patterns
function extractPromptsFromText(text: string, source: string): RawPrompt[] {
  const prompts: RawPrompt[] = [];
  const seenTitles = new Set<string>();
  
  // Pattern 1: Numbered prompts with "You are" system prompts
  // Matches: "1. Title Name\n\nDescription...\n\nYou are..."
  const pattern1 = /(?:^|\n)(\d+)\.\s*([A-Z][^\n]{5,100})\n+([\s\S]*?)(?=You are[^.]*\.[\s\S]*?(?:Instructions:|Constraints:|$))(You are[\s\S]*?)(?=(?:\n\d+\.\s*[A-Z])|$)/gi;
  
  // Pattern 2: Title with "Prompt:" prefix
  const pattern2 = /(?:Prompt[:\s]+)([^\n]{10,100})\n+([\s\S]*?)(?:You are[\s\S]*?)(You are[\s\S]*?)(?=(?:Prompt[:\s]+)|$)/gi;
  
  // Pattern 3: Section headers (### Title)
  const pattern3 = /(?:###\s*)([^\n]{10,100})\n+([\s\S]*?)(?:You are[\s\S]*?)(You are[\s\S]*?)(?=(?:###\s*)|$)/gi;
  
  // Pattern 4: Bold titles (**Title**)
  const pattern4 = /\*\*([^*]{10,100})\*\*\n+([\s\S]*?)(?:You are[\s\S]*?)(You are[\s\S]*?)(?=(?:\*\*[^*]{10,})|$)/gi;
  
  // Pattern 5: More flexible - look for "You are" followed by role description
  const pattern5 = /([A-Z][A-Za-z\s,'-]{10,80}(?:Expert|Advisor|Coach|Specialist|Consultant|Analyst|Guide|Mentor|Strategist|Architect|Designer|Planner|Manager|Assistant|Agent|Oracle|Healer|Warrior))\s*\n+([\s\S]{50,500}?)\n*(You are[\s\S]{100,3000}?)(?=(?:[A-Z][A-Za-z\s,'-]{10,80}(?:Expert|Advisor|Coach))|$)/gi;
  
  // Try all patterns
  const patterns = [pattern1, pattern2, pattern3, pattern4, pattern5];
  
  for (const pattern of patterns) {
    let match;
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(text)) !== null) {
      let title: string;
      let description: string;
      let systemPrompt: string;
      
      if (pattern === pattern1) {
        // Pattern 1: number, title, desc, system
        title = cleanText(match[2]);
        description = cleanText(match[3]);
        systemPrompt = cleanText(match[4]);
      } else {
        // Other patterns: title, desc, system
        title = cleanText(match[1]);
        description = cleanText(match[2]);
        systemPrompt = cleanText(match[3]);
      }
      
      // Validate extraction
      if (
        title.length >= 10 &&
        title.length <= 150 &&
        systemPrompt.length >= 100 &&
        !seenTitles.has(title.toLowerCase())
      ) {
        seenTitles.add(title.toLowerCase());
        
        // Clean up description
        if (description.length < 50) {
          description = `This prompt transforms the AI into an expert assistant: ${title}`;
        }
        if (description.length > 500) {
          description = description.substring(0, 497) + '...';
        }
        
        prompts.push({
          title,
          description,
          systemPrompt,
          source,
        });
      }
    }
  }
  
  return prompts;
}

// Alternative extraction - look for structured prompt blocks
function extractStructuredPrompts(text: string, source: string): RawPrompt[] {
  const prompts: RawPrompt[] = [];
  const seenTitles = new Set<string>();
  
  // Split by common prompt delimiters
  const sections = text.split(/(?=\d+\.\s+[A-Z][A-Za-z\s,'-]+(?:\n|:))/);
  
  for (const section of sections) {
    if (section.length < 200) continue;
    
    // Try to extract title
    const titleMatch = section.match(/^(\d+)\.\s*([^\n:]{10,100})[\n:]/);
    if (!titleMatch) continue;
    
    const title = cleanText(titleMatch[2]);
    if (seenTitles.has(title.toLowerCase())) continue;
    
    // Find system prompt (starts with "You are")
    const systemMatch = section.match(/You are[\s\S]{100,}/i);
    if (!systemMatch) continue;
    
    // Extract description (text between title and "You are")
    const descStart = section.indexOf(titleMatch[0]) + titleMatch[0].length;
    const descEnd = section.toLowerCase().indexOf('you are');
    let description = '';
    
    if (descEnd > descStart) {
      description = cleanText(section.substring(descStart, descEnd));
    }
    
    if (description.length < 50) {
      description = `This prompt transforms the AI into an expert assistant: ${title}`;
    }
    if (description.length > 500) {
      description = description.substring(0, 497) + '...';
    }
    
    const systemPrompt = cleanText(systemMatch[0]);
    
    if (title.length >= 10 && systemPrompt.length >= 100) {
      seenTitles.add(title.toLowerCase());
      prompts.push({
        title,
        description,
        systemPrompt,
        source,
      });
    }
  }
  
  return prompts;
}

// Convert raw prompts to final format
function convertToPrompt(raw: RawPrompt): Prompt {
  const id = generateId(raw.title);
  const category = detectCategory(raw.title, raw.description, raw.systemPrompt, raw.source);
  const tags = detectTags(raw.title, raw.description, raw.systemPrompt);
  
  return {
    id,
    name: raw.title,
    description: raw.description,
    category,
    systemPromptTemplate: raw.systemPrompt,
    tags,
    source: raw.source,
  };
}

// Deduplicate prompts by ID
function deduplicatePrompts(prompts: Prompt[]): Prompt[] {
  const seen = new Map<string, Prompt>();
  
  for (const prompt of prompts) {
    const existing = seen.get(prompt.id);
    if (!existing || prompt.systemPromptTemplate.length > existing.systemPromptTemplate.length) {
      seen.set(prompt.id, prompt);
    }
  }
  
  return Array.from(seen.values());
}

// Main extraction function
async function extractAllPrompts(): Promise<void> {
  console.log('Starting comprehensive PDF extraction...\n');
  console.log(`Data directory: ${DATA_DIR}`);
  
  const pdfFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf')).sort();
  console.log(`Found ${pdfFiles.length} PDF files:\n`);
  pdfFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');
  
  const allPrompts: Prompt[] = [];
  
  for (const pdfFile of pdfFiles) {
    const filePath = path.join(DATA_DIR, pdfFile);
    
    // Determine source from filename
    let source = 'Codex 1';
    if (pdfFile.includes('2')) source = 'Codex 2';
    else if (pdfFile.includes('3')) source = 'Codex 3';
    else if (pdfFile.includes('4')) source = 'Codex 4';
    
    console.log(`\nProcessing: ${pdfFile}`);
    console.log(`  Source: ${source}`);
    
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer, {
        max: 0, // No page limit
      });
      
      console.log(`  Pages: ${data.numpages}`);
      console.log(`  Text length: ${data.text.length.toLocaleString()} characters`);
      
      // Try multiple extraction methods
      const method1 = extractPromptsFromText(data.text, source);
      console.log(`  Method 1 (patterns): ${method1.length} prompts`);
      
      const method2 = extractStructuredPrompts(data.text, source);
      console.log(`  Method 2 (structured): ${method2.length} prompts`);
      
      // Combine and deduplicate
      const combined = [...method1, ...method2];
      const converted = combined.map(convertToPrompt);
      const deduped = deduplicatePrompts(converted);
      
      console.log(`  Total unique: ${deduped.length} prompts`);
      allPrompts.push(...deduped);
      
    } catch (error) {
      console.error(`  ERROR: ${error}`);
    }
  }
  
  // Final deduplication across all sources
  const finalPrompts = deduplicatePrompts(allPrompts);
  
  console.log('\n========================================');
  console.log(`Total extracted: ${finalPrompts.length} prompts`);
  console.log('========================================\n');
  
  // Category breakdown
  const categoryCount: Record<string, number> = {};
  const sourceCount: Record<string, number> = {};
  
  for (const p of finalPrompts) {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    sourceCount[p.source] = (sourceCount[p.source] || 0) + 1;
  }
  
  console.log('By category:');
  Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  console.log('\nBy source:');
  Object.entries(sourceCount).sort().forEach(([src, count]) => {
    console.log(`  ${src}: ${count}`);
  });
  
  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalPrompts, null, 2));
  console.log(`\nSaved to: ${OUTPUT_FILE}`);
}

// Run extraction
extractAllPrompts().catch(console.error);

