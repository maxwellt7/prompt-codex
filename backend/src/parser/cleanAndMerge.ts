import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Prompt } from '../prompts/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXISTING_FILE = path.resolve(__dirname, '../prompts/cleanedPrompts.json');
const EXTRACTED_FILE = path.resolve(__dirname, '../prompts/allPrompts.json');
const OUTPUT_FILE = path.resolve(__dirname, '../prompts/finalPrompts.json');

// Patterns that indicate a malformed title
const BAD_TITLE_PATTERNS = [
  /^[\d]+\./,                    // Starts with number and period
  /^[a-z]/,                      // Starts with lowercase
  /^(Ask|Begin|Greet|Analyze|Perform|Create|Provide|Start|Use|Generate)/,  // Instruction verbs
  /^(The user|Your|This|If|When|Based on|For each)/i,  // Context phrases  
  /^[A-Z]\s+[A-Z]/,              // Multiple single letters
  /^\d+\s/,                      // Starts with just numbers
  /^(A|An|The)\s[a-z]/,          // Article + lowercase
  /preferences|instructions|constraints|output/i,  // Section headers
];

// Minimum requirements for valid prompt
function isValidPrompt(prompt: Prompt): boolean {
  const name = prompt.name;
  const desc = prompt.description;
  const system = prompt.systemPromptTemplate;
  
  // Check name isn't obviously bad
  for (const pattern of BAD_TITLE_PATTERNS) {
    if (pattern.test(name)) {
      return false;
    }
  }
  
  // Name should be proper title (multiple words, reasonable length)
  if (name.length < 10 || name.length > 100) return false;
  if (name.split(' ').length < 2) return false;
  
  // System prompt should be substantial
  if (system.length < 100) return false;
  
  // System prompt should contain "You are" or similar
  if (!/(you are|act as|serve as|your role)/i.test(system)) return false;
  
  // Description should be meaningful
  if (desc.length < 30) return false;
  
  return true;
}

// Normalize prompt ID
function normalizeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

// Clean up prompt data
function cleanPrompt(prompt: Prompt): Prompt {
  // Clean name - remove trailing colons, extra spaces
  let name = prompt.name
    .replace(/[:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter of each word for title case
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Clean description
  let description = prompt.description
    .replace(/\s+/g, ' ')
    .trim();
  
  // Ensure description doesn't start with instruction-like text
  if (/^[\d]+\./.test(description)) {
    description = `This prompt provides expert AI assistance for: ${name}`;
  }
  
  // Clean system prompt
  const systemPromptTemplate = prompt.systemPromptTemplate
    .replace(/\s+/g, ' ')
    .trim();
  
  return {
    ...prompt,
    id: normalizeId(name),
    name,
    description: description.length > 500 ? description.substring(0, 497) + '...' : description,
    systemPromptTemplate,
  };
}

// Main function
async function cleanAndMerge(): Promise<void> {
  console.log('Loading existing prompts...');
  const existingPrompts: Prompt[] = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf-8'));
  console.log(`  Loaded ${existingPrompts.length} existing prompts`);
  
  console.log('\nLoading extracted prompts...');
  const extractedPrompts: Prompt[] = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf-8'));
  console.log(`  Loaded ${extractedPrompts.length} extracted prompts`);
  
  // Filter valid extracted prompts
  console.log('\nFiltering extracted prompts...');
  const validExtracted = extractedPrompts.filter(isValidPrompt);
  console.log(`  Valid: ${validExtracted.length} of ${extractedPrompts.length}`);
  
  // Clean all prompts
  const cleanedExisting = existingPrompts.map(cleanPrompt);
  const cleanedExtracted = validExtracted.map(cleanPrompt);
  
  // Create ID map from existing (higher priority)
  const promptMap = new Map<string, Prompt>();
  
  // Add existing prompts first (they're curated, higher quality)
  for (const prompt of cleanedExisting) {
    promptMap.set(prompt.id, prompt);
  }
  
  // Add extracted prompts if not already present
  let newCount = 0;
  for (const prompt of cleanedExtracted) {
    if (!promptMap.has(prompt.id)) {
      promptMap.set(prompt.id, prompt);
      newCount++;
    }
  }
  
  console.log(`\nMerged: ${newCount} new prompts added`);
  
  const finalPrompts = Array.from(promptMap.values());
  
  // Sort by source then name
  finalPrompts.sort((a, b) => {
    if (a.source !== b.source) {
      return a.source.localeCompare(b.source);
    }
    return a.name.localeCompare(b.name);
  });
  
  console.log(`\nFinal count: ${finalPrompts.length} prompts`);
  
  // Category breakdown
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

cleanAndMerge().catch(console.error);

