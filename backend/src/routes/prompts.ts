import { Router, Request, Response } from 'express';
import { CATEGORIES } from '../prompts/types.js';
import { 
  getAllPrompts, 
  getPromptsByCategory, 
  getPromptById, 
  getCategoryStats,
  filterPrompts,
  getAllSources,
  getAllTags,
  FilterOptions
} from '../prompts/promptData.js';

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

// Get all prompts with filtering, search, and pagination
router.get('/prompts', (req: Request, res: Response) => {
  const { 
    search, 
    category, 
    source, 
    tags,
    page = '1', 
    limit = '30',
    sort = 'name'
  } = req.query;
  
  // Build filter options
  const filterOptions: FilterOptions = {};
  
  if (search && typeof search === 'string') {
    filterOptions.search = search;
  }
  
  if (category && typeof category === 'string' && category !== 'all') {
    filterOptions.category = category;
  }
  
  if (source && typeof source === 'string' && source !== 'all') {
    filterOptions.source = source;
  }
  
  if (tags && typeof tags === 'string') {
    filterOptions.tags = tags.split(',').filter(t => t.trim());
  }
  
  // Filter prompts
  let prompts = filterPrompts(filterOptions);
  
  // Sort prompts
  const sortKey = typeof sort === 'string' ? sort : 'name';
  prompts.sort((a, b) => {
    switch (sortKey) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'source':
        return a.source.localeCompare(b.source);
      default:
        return a.name.localeCompare(b.name);
    }
  });
  
  // Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 30));
  const totalCount = prompts.length;
  const totalPages = Math.ceil(totalCount / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedPrompts = prompts.slice(startIndex, endIndex);
  
  // Return prompts without the full system prompt template for list view
  const promptSummaries = paginatedPrompts.map(({ id, name, description, category, tags, source }) => ({
    id,
    name,
    description,
    category,
    tags,
    source,
  }));
  
  res.json({
    prompts: promptSummaries,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount,
      totalPages,
      hasMore: pageNum < totalPages,
    },
  });
});

// Get filter options (sources and tags)
router.get('/filters', (req: Request, res: Response) => {
  const sources = getAllSources();
  const tags = getAllTags();
  const categories = CATEGORIES.map(c => ({ id: c.id, name: c.name }));
  
  res.json({
    sources,
    tags,
    categories,
  });
});

export { router as promptRoutes };
