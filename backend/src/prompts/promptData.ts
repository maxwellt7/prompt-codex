import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Prompt, CATEGORIES } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all prompts from JSON
let PROMPTS: Prompt[] = [];

try {
  const cleanedPromptsPath = path.join(__dirname, 'cleanedPrompts.json');
  if (fs.existsSync(cleanedPromptsPath)) {
    const data = fs.readFileSync(cleanedPromptsPath, 'utf-8');
    PROMPTS = JSON.parse(data);
    console.log(`Loaded ${PROMPTS.length} prompts from cleanedPrompts.json`);
  }
} catch (error) {
  console.error('Error loading prompts:', error);
}

// Get prompts by category
export function getPromptsByCategory(categoryId: string): Prompt[] {
  return PROMPTS.filter(p => p.category === categoryId);
}

// Get prompt by ID
export function getPromptById(id: string): Prompt | undefined {
  return PROMPTS.find(p => p.id === id);
}

// Get all prompts
export function getAllPrompts(): Prompt[] {
  return PROMPTS;
}

// Get category stats
export function getCategoryStats(): { categoryId: string; count: number }[] {
  const stats = new Map<string, number>();
  
  for (const prompt of PROMPTS) {
    stats.set(prompt.category, (stats.get(prompt.category) || 0) + 1);
  }
  
  return Array.from(stats.entries()).map(([categoryId, count]) => ({
    categoryId,
    count,
  }));
}

// Search prompts by query
export function searchPrompts(query: string): Prompt[] {
  const lowerQuery = query.toLowerCase();
  return PROMPTS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

// Filter prompts with multiple criteria
export interface FilterOptions {
  search?: string;
  category?: string;
  source?: string;
  tags?: string[];
}

export function filterPrompts(options: FilterOptions): Prompt[] {
  let filtered = [...PROMPTS];
  
  if (options.search) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  if (options.category) {
    filtered = filtered.filter(p => p.category === options.category);
  }
  
  if (options.source) {
    filtered = filtered.filter(p => p.source === options.source);
  }
  
  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter(p =>
      options.tags!.some(tag => p.tags.includes(tag))
    );
  }
  
  return filtered;
}

// Get all unique sources
export function getAllSources(): string[] {
  const sources = new Set<string>();
  for (const prompt of PROMPTS) {
    sources.add(prompt.source);
  }
  return Array.from(sources).sort();
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const prompt of PROMPTS) {
    for (const tag of prompt.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export { PROMPTS, CATEGORIES };
