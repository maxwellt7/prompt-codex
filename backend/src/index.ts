import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { promptRoutes } from './routes/prompts.js';
import { chatRoutes } from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Get frontend URL and remove trailing slash if present
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

// Middleware
app.use(cors({
  origin: [
    frontendUrl,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://prompt-codex.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', promptRoutes);
app.use('/api', chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

