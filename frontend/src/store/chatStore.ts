import { create } from 'zustand';
import type { Chat, Message } from '../api/client';

interface ChatState {
  // Active chat state
  currentChatId: string | null;
  currentMessages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  
  // Sidebar chats
  chats: Chat[];
  
  // Actions
  setCurrentChat: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  appendStreamingContent: (content: string) => void;
  clearStreamingContent: () => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChatId: null,
  currentMessages: [],
  isStreaming: false,
  streamingContent: '',
  chats: [],

  setCurrentChat: (chatId) => set({ currentChatId: chatId }),
  
  setMessages: (messages) => set({ currentMessages: messages }),
  
  addMessage: (message) =>
    set((state) => ({
      currentMessages: [...state.currentMessages, message],
    })),

  setIsStreaming: (isStreaming) => set({ isStreaming }),
  
  appendStreamingContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),

  clearStreamingContent: () => set({ streamingContent: '' }),

  setChats: (chats) => set({ chats }),
  
  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  updateChat: (chatId, updates) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    })),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
    })),
}));

