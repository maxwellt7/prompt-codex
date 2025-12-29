export interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  systemPromptTemplate: string;
  tags: string[];
  source: string; // Which codex it came from
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'foundational',
    name: 'Foundational Prompts',
    description: 'Core dialogue patterns and cognitive design principles for effective AI communication',
    icon: 'foundation',
    color: '#4ecdc4',
    promptCount: 0,
  },
  {
    id: 'strategic',
    name: 'Strategic Agents',
    description: 'Systems thinking, strategic planning, and decision-making frameworks',
    icon: 'strategy',
    color: '#ff6b6b',
    promptCount: 0,
  },
  {
    id: 'specialized',
    name: 'Specialized Agents',
    description: 'Domain-specific expert personas for targeted assistance',
    icon: 'expert',
    color: '#ffd93d',
    promptCount: 0,
  },
  {
    id: 'cognitive',
    name: 'Cognitive Interfaces',
    description: 'Deep thinking, philosophical inquiry, and analytical frameworks',
    icon: 'brain',
    color: '#a855f7',
    promptCount: 0,
  },
  {
    id: 'transformational',
    name: 'Transformational Prompts',
    description: 'Personal growth, breakthrough thinking, and self-improvement',
    icon: 'transform',
    color: '#06b6d4',
    promptCount: 0,
  },
  {
    id: 'agentic',
    name: 'Agentic Archetypes',
    description: 'Character-based AI personas with distinct perspectives and expertise',
    icon: 'persona',
    color: '#f97316',
    promptCount: 0,
  },
  {
    id: 'metacognitive',
    name: 'Meta-Cognitive',
    description: 'Prompts about prompting, reflection, and meta-level thinking',
    icon: 'meta',
    color: '#ec4899',
    promptCount: 0,
  },
];

