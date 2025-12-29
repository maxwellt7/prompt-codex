# Prompt Codex Dashboard

A beautiful dashboard for exploring and engaging with AI prompts from your Prompt Codex collection. Built with React, Express, and Claude.

## Features

- 📚 **Organized Prompts**: 30 curated prompts across 7 categories
- 💬 **AI Conversations**: Chat with Claude using specialized system prompts
- 📊 **Chat History**: Track active and completed conversations
- 🧠 **Knowledge Base**: Completed chats are embedded and stored in Pinecone
- 🎨 **Beautiful UI**: Dark theme with glassmorphism and smooth animations

## Architecture

```
prompt-codex-dashboard/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Express + TypeScript + Prisma
└── data/              # PDF source files
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS, React Query, Zustand |
| Backend | Node.js, Express, TypeScript, Prisma |
| Database | PostgreSQL |
| LLM | Anthropic Claude |
| Embeddings | Cohere |
| Vector Store | Pinecone |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for Anthropic, Cohere, and Pinecone

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Environment Variables

### Backend (.env)

```env
PORT=3001
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
COHERE_API_KEY=...
PINECONE_API_KEY=...
PINECONE_INDEX=chat-embeddings-1024
PINECONE_HOST=https://...
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

## Prompt Categories

1. **Foundational Prompts** - Core dialogue patterns and cognitive design
2. **Strategic Agents** - Systems thinking and decision-making
3. **Specialized Agents** - Domain-specific expert personas
4. **Cognitive Interfaces** - Deep thinking and philosophical inquiry
5. **Transformational Prompts** - Personal growth and breakthrough thinking
6. **Agentic Archetypes** - Character-based AI personas
7. **Meta-Cognitive** - Prompts about prompting and reflection

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend-url/api`
4. Deploy

### Backend (Railway)

1. Create a new project on Railway
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Add environment variables from `.env.example`
6. Deploy

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all prompt categories |
| GET | `/api/prompts/:category` | Get prompts in a category |
| GET | `/api/prompt/:id` | Get prompt details |
| POST | `/api/chat/start` | Start a new chat |
| POST | `/api/chat/:id/message` | Send a message |
| POST | `/api/chat/:id/complete` | Complete and save chat |
| GET | `/api/chats` | List all chats |

## License

MIT

