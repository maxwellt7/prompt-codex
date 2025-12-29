import { Router, Request, Response } from 'express';
import { CATEGORIES } from '../prompts/types.js';
import { getAllPrompts, getPromptsByCategory, getPromptById, getCategoryStats } from '../prompts/promptData.js';

const router = Router();

// Get all categories with prompt counts
router.get('/categories', (req: Request, res: Response) => {
  const stats = getCategoryStats();
  
  const categoriesWithCounts = CATEGORIES.map(cat => ({
    ...cat,
    promptCount: stats.find(s => s.categoryId === cat.id)?.count || 0,
  }));
  
  res.json(categoriesWithCounts);
});

// Get prompts by category
router.get('/prompts/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  const prompts = getPromptsByCategory(category);
  
  if (prompts.length === 0) {
    // Check if category exists
    const categoryExists = CATEGORIES.some(c => c.id === category);
    if (!categoryExists) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
  }
  
  // Return prompts without the full system prompt template for list view
  const promptSummaries = prompts.map(({ id, name, description, category, tags, source }) => ({
    id,
    name,
    description,
    category,
    tags,
    source,
  }));
  
  res.json(promptSummaries);
});

// Get single prompt details
router.get('/prompt/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const prompt = getPromptById(id);
  
  if (!prompt) {
    res.status(404).json({ error: 'Prompt not found' });
    return;
  }
  
  res.json(prompt);
});

// Get all prompts (for search)
router.get('/prompts', (req: Request, res: Response) => {
  const prompts = getAllPrompts();
  
  const promptSummaries = prompts.map(({ id, name, description, category, tags, source }) => ({
    id,
    name,
    description,
    category,
    tags,
    source,
  }));
  
  res.json(promptSummaries);
});

export { router as promptRoutes };

