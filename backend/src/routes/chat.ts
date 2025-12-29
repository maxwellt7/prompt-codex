import { Router, Request, Response } from 'express';
import { prisma } from '../db/client.js';
import { getPromptById } from '../prompts/promptData.js';
import { createChatCompletion, createStreamingChatCompletion, generateConversationSummary, Message } from '../services/anthropic.js';
import { generateEmbedding } from '../services/cohere.js';
import { storeChatEmbedding, ChatMetadata } from '../services/pinecone.js';

const router = Router();

// Start a new chat
router.post('/chat/start', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.body;

    if (!promptId) {
      res.status(400).json({ error: 'promptId is required' });
      return;
    }

    const prompt = getPromptById(promptId);
    if (!prompt) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }

    // Create the chat in the database
    const chat = await prisma.chat.create({
      data: {
        promptId: prompt.id,
        promptName: prompt.name,
        category: prompt.category,
        systemPrompt: prompt.systemPromptTemplate,
        status: 'active',
      },
    });

    // Get initial greeting from the AI
    const initialMessage = await createChatCompletion(
      prompt.systemPromptTemplate,
      []
    );

    // Store the initial assistant message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: initialMessage,
      },
    });

    res.json({
      id: chat.id,
      promptId: chat.promptId,
      promptName: chat.promptName,
      category: chat.category,
      status: chat.status,
      createdAt: chat.createdAt,
      initialMessage,
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

// Send a message to an existing chat
router.post('/chat/:id/message', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    // Get the chat
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (chat.status !== 'active') {
      res.status(400).json({ error: 'Chat is already completed' });
      return;
    }

    // Store user message
    await prisma.message.create({
      data: {
        chatId: id,
        role: 'user',
        content,
      },
    });

    // Prepare message history for API
    const messages: Message[] = [
      ...chat.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content },
    ];

    // Get AI response
    const assistantResponse = await createChatCompletion(
      chat.systemPrompt,
      messages
    );

    // Store assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        chatId: id,
        role: 'assistant',
        content: assistantResponse,
      },
    });

    res.json({
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantResponse,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Stream a message response
router.post('/chat/:id/message/stream', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    // Get the chat
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (chat.status !== 'active') {
      res.status(400).json({ error: 'Chat is already completed' });
      return;
    }

    // Store user message
    await prisma.message.create({
      data: {
        chatId: id,
        role: 'user',
        content,
      },
    });

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Prepare message history
    const messages: Message[] = [
      ...chat.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content },
    ];

    // Stream the response
    const fullResponse = await createStreamingChatCompletion(
      chat.systemPrompt,
      messages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }
    );

    // Store the complete assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        chatId: id,
        role: 'assistant',
        content: fullResponse,
      },
    });

    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'done', 
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: fullResponse,
        createdAt: assistantMessage.createdAt,
      }
    })}\n\n`);

    res.end();
  } catch (error) {
    console.error('Error streaming message:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to stream message' })}\n\n`);
    res.end();
  }
});

// Complete a chat and store to Pinecone
router.post('/chat/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the chat with messages
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    if (chat.status === 'completed') {
      res.status(400).json({ error: 'Chat is already completed' });
      return;
    }

    // Generate conversation summary
    const messages = chat.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
    
    const { summary, keyTopics } = await generateConversationSummary(messages);

    // Create text for embedding (summary + key messages)
    const conversationText = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n\n');

    const textForEmbedding = `${summary}\n\nKey topics: ${keyTopics.join(', ')}\n\nConversation:\n${conversationText}`;

    // Generate embedding
    const embedding = await generateEmbedding(textForEmbedding);

    // Store in Pinecone
    const metadata: ChatMetadata = {
      chatId: chat.id,
      promptName: chat.promptName,
      promptId: chat.promptId,
      category: chat.category,
      summary,
      keyTopics,
      date: new Date().toISOString().split('T')[0],
      messageCount: chat.messages.length,
      conversationText,
    };

    await storeChatEmbedding(embedding, metadata);

    // Update chat status
    const updatedChat = await prisma.chat.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    res.json({
      id: updatedChat.id,
      status: updatedChat.status,
      completedAt: updatedChat.completedAt,
      summary,
      keyTopics,
    });
  } catch (error) {
    console.error('Error completing chat:', error);
    res.status(500).json({ error: 'Failed to complete chat' });
  }
});

// Get all chats (for sidebar)
router.get('/chats', async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        promptId: true,
        promptName: true,
        category: true,
        status: true,
        createdAt: true,
        completedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    res.json(chats.map(chat => ({
      ...chat,
      messageCount: chat._count.messages,
      _count: undefined,
    })));
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get a single chat with messages
router.get('/chat/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Delete a chat
router.delete('/chat/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.chat.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export { router as chatRoutes };

