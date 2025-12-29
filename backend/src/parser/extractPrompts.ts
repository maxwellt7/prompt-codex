import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import pdf from 'pdf-parse';
import { Prompt } from '../prompts/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../../data');
const OUTPUT_FILE = path.resolve(__dirname, '../prompts/extractedPrompts.json');

interface ExtractedPrompt {
  title: string;
  content: string;
  source: string;
}

// Function to clean and normalize text from PDF
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();
}

// Function to extract prompts from PDF text
function extractPromptsFromText(text: string, source: string): ExtractedPrompt[] {
  const prompts: ExtractedPrompt[] = [];
  
  // Look for patterns that indicate prompt sections
  // Common patterns: numbered prompts, headers with "Prompt:", sections marked with ###
  const promptPatterns = [
    /(?:^|\n)(?:Prompt\s*\d*[:.]\s*|###\s*)([^\n]+)\n([\s\S]*?)(?=(?:\n(?:Prompt\s*\d*[:.]\s*|###\s*))|$)/gi,
    /(?:^|\n)(\d+\.\s*[A-Z][^\n]+)\n([\s\S]*?)(?=(?:\n\d+\.\s*[A-Z])|$)/gi,
  ];

  for (const pattern of promptPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      
      if (title.length > 5 && content.length > 50) {
        prompts.push({
          title,
          content: cleanText(content),
          source,
        });
      }
    }
  }

  return prompts;
}

// Main extraction function
async function extractAllPrompts(): Promise<void> {
  console.log('Starting PDF extraction...');
  
  const pdfFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files`);
  
  const allExtracted: ExtractedPrompt[] = [];

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(DATA_DIR, pdfFile);
    console.log(`Processing: ${pdfFile}`);
    
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      
      console.log(`  - Pages: ${data.numpages}`);
      console.log(`  - Text length: ${data.text.length} chars`);
      
      const extracted = extractPromptsFromText(data.text, pdfFile);
      console.log(`  - Extracted ${extracted.length} prompts`);
      
      allExtracted.push(...extracted);
    } catch (error) {
      console.error(`  - Error processing ${pdfFile}:`, error);
    }
  }

  console.log(`\nTotal extracted: ${allExtracted.length} prompts`);
  
  // Save extracted prompts
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allExtracted, null, 2));
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

// Run extraction
extractAllPrompts().catch(console.error);

