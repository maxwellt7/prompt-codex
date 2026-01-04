import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Prompt } from '../prompts/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXISTING_FILE = path.resolve(__dirname, '../prompts/cleanedPrompts.json');
const EXTRACTED_FILE = path.resolve(__dirname, '../prompts/allPrompts.json');
const OUTPUT_FILE = path.resolve(__dirname, '../prompts/cleanedPrompts.json');

// Words that indicate a proper prompt title
const TITLE_INDICATORS = [
  'expert', 'advisor', 'coach', 'guide', 'consultant', 'mentor', 'strategist',
  'architect', 'analyst', 'specialist', 'master', 'planner', 'creator',
  'designer', 'builder', 'generator', 'assistant', 'companion', 'oracle',
  'healer', 'warrior', 'sage', 'mystic', 'rebel', 'sovereign', 'trickster',
  'alchemist', 'guardian', 'navigator', 'curator', 'decoder', 'transformer',
  'simulator', 'evaluator', 'assessor', 'tutor', 'trainer', 'therapist',
];

// Bad title patterns
const BAD_PATTERNS = [
  /^[\d]+[\.\)]/,                  // Starts with number and period/paren
  /^[a-z]/,                        // Starts with lowercase
  /^(Ask|Begin|Greet|Analyze|Perform|Create|Provide|Start|Use|Generate|Request|Accept|Acknowledge)/i,
  /^(The user|Your|This|If|When|Based on|For each)/i,
  /^[A-Z]\s+[A-Z]\s/,              // Multiple single letters
  /preferences|instructions|constraints|output|format|reasoning/i,
  /^Prompt Details$/i,
  /^\(e\.g\./i,
  /^Example/i,
  /^Step\s+\d/i,
  /^Section/i,
  /^Phase/i,
  /^\d+\s+(days?|weeks?|months?)/i,
];

// Check if name is a proper title
function isProperTitle(name: string): boolean {
  const lowerName = name.toLowerCase();
  
  // Check for bad patterns
  for (const pattern of BAD_PATTERNS) {
    if (pattern.test(name)) {
      return false;
    }
  }
  
  // Should have 2-8 words
  const words = name.split(/\s+/);
  if (words.length < 2 || words.length > 12) return false;
  
  // Name should be 15-100 chars
  if (name.length < 15 || name.length > 100) return false;
  
  // Prefer names with title indicators
  const hasIndicator = TITLE_INDICATORS.some(ind => lowerName.includes(ind));
  
  // Or has common title patterns
  const hasPattern = /^(The|Your|Personal|AI|Virtual|Strategic|Master|Expert|Professional)/i.test(name);
  
  return hasIndicator || hasPattern;
}

// Validate system prompt quality
function isValidSystemPrompt(prompt: string): boolean {
  if (prompt.length < 150) return false;
  if (prompt.length > 10000) return false;
  
  // Should contain role definition
  if (!/(you are|act as|your role|i want you to act)/i.test(prompt)) return false;
  
  // Should contain instructions or guidance
  if (!/(instruct|guide|help|assist|provide|analyze|create)/i.test(prompt)) return false;
  
  return true;
}

// Main validation
function isValidPrompt(prompt: Prompt): boolean {
  return isProperTitle(prompt.name) && isValidSystemPrompt(prompt.systemPromptTemplate);
}

// Normalize ID
function normalizeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

// Clean prompt
function cleanPrompt(prompt: Prompt): Prompt {
  let name = prompt.name.replace(/[:]+$/, '').replace(/\s+/g, ' ').trim();
  
  // Proper title case
  name = name.split(' ')
    .map((word, i) => {
      const lower = word.toLowerCase();
      // Keep certain words lowercase unless first word
      if (i > 0 && ['a', 'an', 'the', 'and', 'or', 'for', 'to', 'in', 'on', 'of', 'with'].includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  let description = prompt.description.replace(/\s+/g, ' ').trim();
  if (description.length > 400) {
    description = description.substring(0, 397) + '...';
  }
  if (description.length < 50) {
    description = `This prompt transforms the AI into an expert assistant for: ${name}`;
  }
  
  return {
    ...prompt,
    id: normalizeId(name),
    name,
    description,
  };
}

async function main() {
  console.log('Loading existing curated prompts...');
  const existingPrompts: Prompt[] = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf-8'));
  console.log(`  Loaded ${existingPrompts.length} existing prompts`);
  
  console.log('\nLoading extracted prompts...');
  const extractedPrompts: Prompt[] = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf-8'));
  console.log(`  Loaded ${extractedPrompts.length} extracted prompts`);
  
  // Filter with strict criteria
  console.log('\nApplying strict filter...');
  const validExtracted = extractedPrompts.filter(isValidPrompt);
  console.log(`  Valid: ${validExtracted.length} of ${extractedPrompts.length}`);
  
  // Create map starting with existing (higher priority)
  const promptMap = new Map<string, Prompt>();
  
  // Add existing prompts
  for (const prompt of existingPrompts) {
    const cleaned = cleanPrompt(prompt);
    promptMap.set(cleaned.id, cleaned);
  }
  console.log(`\nStarting with ${promptMap.size} existing prompts`);
  
  // Add valid extracted prompts
  let newCount = 0;
  for (const prompt of validExtracted) {
    const cleaned = cleanPrompt(prompt);
    if (!promptMap.has(cleaned.id)) {
      promptMap.set(cleaned.id, cleaned);
      newCount++;
    }
  }
  console.log(`Added ${newCount} new prompts`);
  
  const finalPrompts = Array.from(promptMap.values());
  
  // Sort by source then name
  finalPrompts.sort((a, b) => {
    if (a.source !== b.source) return a.source.localeCompare(b.source);
    return a.name.localeCompare(b.name);
  });
  
  console.log(`\nFinal count: ${finalPrompts.length} prompts`);
  
  // Stats
  const categoryCount: Record<string, number> = {};
  const sourceCount: Record<string, number> = {};
  
  for (const p of finalPrompts) {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    sourceCount[p.source] = (sourceCount[p.source] || 0) + 1;
  }
  
  console.log('\nBy category:');
  Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  console.log('\nBy source:');
  Object.entries(sourceCount).sort().forEach(([src, count]) => {
    console.log(`  ${src}: ${count}`);
  });
  
  // Save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalPrompts, null, 2));
  console.log(`\nSaved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);

