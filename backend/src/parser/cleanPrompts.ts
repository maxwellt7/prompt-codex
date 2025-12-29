import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import pdf from 'pdf-parse';
import { Prompt } from '../prompts/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../../data');
const OUTPUT_FILE = path.resolve(__dirname, '../prompts/cleanedPrompts.json');

interface RawPrompt {
  title: string;
  description: string;
  promptContent: string;
  useCases: string[];
  source: string;
  pageNumber?: number;
}

// Category mapping based on keywords
function categorizePrompt(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  // Strategic / Business
  if (text.includes('business') || text.includes('strategy') || text.includes('advisor') ||
      text.includes('investment') || text.includes('market') || text.includes('ceo') ||
      text.includes('salesforce') || text.includes('crm') || text.includes('entrepreneur') ||
      text.includes('negotiation') || text.includes('enterprise') || text.includes('finance') ||
      text.includes('401k') || text.includes('budget') || text.includes('income') ||
      text.includes('marketing') || text.includes('sales')) {
    return 'strategic';
  }
  
  // Specialized / Expert
  if (text.includes('expert') || text.includes('specialist') || text.includes('master') ||
      text.includes('excel') || text.includes('power bi') || text.includes('aws') ||
      text.includes('azure') || text.includes('cloud') || text.includes('architect') ||
      text.includes('linux') || text.includes('windows') || text.includes('plantuml') ||
      text.includes('automation') || text.includes('system admin') || text.includes('coding') ||
      text.includes('developer') || text.includes('programming')) {
    return 'specialized';
  }
  
  // Cognitive / Thinking
  if (text.includes('thinking') || text.includes('decision') || text.includes('problem-solving') ||
      text.includes('analysis') || text.includes('reasoning') || text.includes('idea') ||
      text.includes('creativity') || text.includes('exploration') || text.includes('dream') ||
      text.includes('philosophical') || text.includes('cognitive')) {
    return 'cognitive';
  }
  
  // Transformational / Growth
  if (text.includes('coach') || text.includes('therapist') || text.includes('counselor') ||
      text.includes('wellness') || text.includes('healing') || text.includes('recovery') ||
      text.includes('anxiety') || text.includes('ptsd') || text.includes('trauma') ||
      text.includes('emotion') || text.includes('mental health') || text.includes('mindful') ||
      text.includes('meditation') || text.includes('empathic') || text.includes('self-') ||
      text.includes('personal growth') || text.includes('life coach')) {
    return 'transformational';
  }
  
  // Agentic / Persona
  if (text.includes('samantha') || text.includes('chappelle') || text.includes('fluffy') ||
      text.includes('drill sergeant') || text.includes('bob ross') || text.includes('mafalda') ||
      text.includes('cunk') || text.includes('wolf') || text.includes('chef') ||
      text.includes('pilkington') || text.includes('resistance') || text.includes('skynet') ||
      text.includes('role') || text.includes('persona') || text.includes('character')) {
    return 'agentic';
  }
  
  // Meta-cognitive
  if (text.includes('prompt') || text.includes('optimizer') || text.includes('workflow') ||
      text.includes('diagram') || text.includes('template') || text.includes('structure')) {
    return 'metacognitive';
  }
  
  // Default to foundational
  return 'foundational';
}

// Generate tags from content
function generateTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  
  const tagKeywords: Record<string, string[]> = {
    'health': ['health', 'medical', 'nutrition', 'diet', 'fitness', 'wellness'],
    'productivity': ['productivity', 'workflow', 'efficiency', 'organize', 'planning'],
    'business': ['business', 'company', 'enterprise', 'corporate', 'startup'],
    'finance': ['finance', 'money', 'investment', 'budget', 'income', 'tax'],
    'technology': ['tech', 'software', 'cloud', 'aws', 'azure', 'coding', 'programming'],
    'creativity': ['creative', 'art', 'design', 'writing', 'music', 'story'],
    'communication': ['communication', 'email', 'writing', 'speaking', 'presentation'],
    'relationships': ['relationship', 'marriage', 'family', 'parenting', 'dating'],
    'career': ['career', 'job', 'resume', 'interview', 'professional'],
    'mindfulness': ['mindful', 'meditation', 'calm', 'peace', 'stress'],
    'coaching': ['coach', 'mentor', 'guide', 'support', 'advisor'],
    'therapy': ['therapy', 'therapist', 'counseling', 'healing', 'trauma'],
    'travel': ['travel', 'trip', 'vacation', 'adventure', 'getaway'],
    'food': ['food', 'recipe', 'cooking', 'chef', 'meal', 'cuisine'],
    'home': ['home', 'house', 'decoration', 'diy', 'garden'],
    'education': ['learning', 'study', 'school', 'college', 'tutor'],
    'entertainment': ['fun', 'game', 'movie', 'music', 'story'],
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5); // Max 5 tags
}

// Create a slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// Extract prompts from PDF text
function extractPromptsFromText(text: string, source: string): RawPrompt[] {
  const prompts: RawPrompt[] = [];
  
  // Split by page markers and section patterns
  const sections = text.split(/\n(?=\d+\s*\|\s*P\s*a\s*g\s*e|\n[A-Z][^a-z\n]{10,}\n)/);
  
  // Look for prompt sections that have Description: and Prompt Details:
  const promptPattern = /([A-Z][^\n]{5,100})\s*\nDescription:\s*([\s\S]*?)(?:Prompt Details:|<System>)/gi;
  
  let match;
  while ((match = promptPattern.exec(text)) !== null) {
    const title = match[1].trim().replace(/\s+/g, ' ');
    const description = match[2].trim()
      .replace(/\s+/g, ' ')
      .replace(/Disclaimer:.*$/, '')
      .slice(0, 500);
    
    // Skip if title is too short or looks like a page header
    if (title.length < 10 || title.match(/^\d+/) || title.includes('Page')) {
      continue;
    }
    
    // Extract the full prompt content (everything after <System> until Use Cases or end)
    const promptStartIndex = match.index + match[0].length;
    const nextPromptMatch = text.slice(promptStartIndex).search(/\n[A-Z][^\n]{10,100}\s*\nDescription:/);
    const promptEndIndex = nextPromptMatch > 0 ? promptStartIndex + nextPromptMatch : promptStartIndex + 2000;
    const fullContent = text.slice(match.index, Math.min(promptEndIndex, text.length));
    
    // Extract use cases if present
    const useCasesMatch = fullContent.match(/Use Cases:\s*([\s\S]*?)(?:Example User Input|$)/i);
    const useCases = useCasesMatch 
      ? useCasesMatch[1].split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/).filter(uc => uc.trim().length > 20)
      : [];
    
    prompts.push({
      title,
      description,
      promptContent: fullContent,
      useCases: useCases.slice(0, 3),
      source,
    });
  }
  
  return prompts;
}

// Convert raw prompts to proper Prompt format
function convertToPrompts(rawPrompts: RawPrompt[]): Prompt[] {
  const seen = new Set<string>();
  const prompts: Prompt[] = [];
  
  for (const raw of rawPrompts) {
    const slug = createSlug(raw.title);
    
    // Skip duplicates
    if (seen.has(slug)) continue;
    seen.add(slug);
    
    // Extract system prompt template from content
    const systemMatch = raw.promptContent.match(/<System>([\s\S]*?)<\/System>/i);
    const contextMatch = raw.promptContent.match(/<Context>([\s\S]*?)<\/Context>/i);
    const instructionsMatch = raw.promptContent.match(/<Instructions>([\s\S]*?)<\/Instructions>/i);
    const constraintsMatch = raw.promptContent.match(/<Constraints?>([\s\S]*?)<\/Constraints?>/i);
    
    let systemPrompt = '';
    
    if (systemMatch) {
      systemPrompt = systemMatch[1].trim();
    }
    if (contextMatch) {
      systemPrompt += '\n\n' + contextMatch[1].trim();
    }
    if (instructionsMatch) {
      systemPrompt += '\n\nInstructions:\n' + instructionsMatch[1].trim();
    }
    if (constraintsMatch) {
      systemPrompt += '\n\nConstraints:\n' + constraintsMatch[1].trim();
    }
    
    // If no system tag found, create a generic one
    if (!systemPrompt) {
      systemPrompt = `You are an AI assistant specialized in ${raw.title}. ${raw.description}\n\nProvide helpful, accurate, and thoughtful assistance to the user.`;
    }
    
    // Clean up the system prompt
    systemPrompt = systemPrompt
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
    
    const category = categorizePrompt(raw.title, raw.description);
    const tags = generateTags(raw.title, raw.description);
    
    // Determine which codex it's from
    let sourceCodex = 'Codex 1';
    if (raw.source.includes('2')) sourceCodex = 'Codex 2';
    if (raw.source.includes('3')) sourceCodex = 'Codex 3';
    if (raw.source.includes('4')) sourceCodex = 'Codex 4';
    
    prompts.push({
      id: slug,
      name: raw.title,
      description: raw.description,
      category,
      systemPromptTemplate: systemPrompt,
      tags: tags.length > 0 ? tags : ['general'],
      source: sourceCodex,
    });
  }
  
  return prompts;
}

// Main extraction function
async function extractAndCleanPrompts(): Promise<void> {
  console.log('Starting comprehensive PDF extraction...\n');
  
  const pdfFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files\n`);
  
  const allRawPrompts: RawPrompt[] = [];

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(DATA_DIR, pdfFile);
    console.log(`Processing: ${pdfFile}`);
    
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      
      console.log(`  - Pages: ${data.numpages}`);
      console.log(`  - Text length: ${data.text.length} chars`);
      
      const extracted = extractPromptsFromText(data.text, pdfFile);
      console.log(`  - Extracted ${extracted.length} prompts\n`);
      
      allRawPrompts.push(...extracted);
    } catch (error) {
      console.error(`  - Error processing ${pdfFile}:`, error);
    }
  }

  console.log(`Total raw prompts: ${allRawPrompts.length}`);
  
  // Convert and deduplicate
  const cleanedPrompts = convertToPrompts(allRawPrompts);
  console.log(`Cleaned and deduplicated: ${cleanedPrompts.length} prompts\n`);
  
  // Group by category for stats
  const categoryStats = new Map<string, number>();
  for (const p of cleanedPrompts) {
    categoryStats.set(p.category, (categoryStats.get(p.category) || 0) + 1);
  }
  
  console.log('Category distribution:');
  for (const [cat, count] of categoryStats) {
    console.log(`  ${cat}: ${count}`);
  }
  
  // Save cleaned prompts
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedPrompts, null, 2));
  console.log(`\nSaved to: ${OUTPUT_FILE}`);
}

// Run extraction
extractAndCleanPrompts().catch(console.error);

