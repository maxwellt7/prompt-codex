import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Message } from '../api/client';
import { useChatStore } from '../store/chatStore';

export function useChats() {
  const { setChats } = useChatStore();

  const query = useQuery({
    queryKey: ['chats'],
    queryFn: api.getChats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (query.data) {
      setChats(query.data);
    }
  }, [query.data, setChats]);

  return query;
}

export function useChat(chatId: string | null) {
  const { setMessages, setCurrentChat } = useChatStore();

  const query = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => (chatId ? api.getChat(chatId) : null),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
    }
  }, [chatId, setCurrentChat]);

  useEffect(() => {
    if (query.data?.messages) {
      setMessages(query.data.messages);
    }
  }, [query.data?.messages, setMessages]);

  return query;
}

export function useStartChat() {
  const queryClient = useQueryClient();
  const { addChat, setCurrentChat, setMessages } = useChatStore();

  return useMutation({
    mutationFn: api.startChat,
    onSuccess: (data) => {
      // Add to chats list
      addChat({
        id: data.id,
        promptId: data.promptId,
        promptName: data.promptName,
        category: data.category,
        status: 'active',
        createdAt: data.createdAt,
        messageCount: 1,
      });

      // Set as current chat
      setCurrentChat(data.id);

      // Set initial message
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.initialMessage,
          createdAt: new Date().toISOString(),
        },
      ]);

      // Invalidate chats query
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const {
    currentChatId,
    addMessage,
    setIsStreaming,
    appendStreamingContent,
    clearStreamingContent,
    updateChat,
  } = useChatStore();

  const sendWithStream = useCallback(
    async (content: string) => {
      if (!currentChatId) return;

      // Add user message immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Start streaming
      setIsStreaming(true);
      clearStreamingContent();

      try {
        await api.sendMessageStream(
          currentChatId,
          content,
          (chunk) => {
            appendStreamingContent(chunk);
          },
          (message) => {
            setIsStreaming(false);
            clearStreamingContent();
            addMessage(message);
            updateChat(currentChatId, { messageCount: (useChatStore.getState().currentMessages.length + 1) });
            queryClient.invalidateQueries({ queryKey: ['chat', currentChatId] });
          }
        );
      } catch (error) {
        setIsStreaming(false);
        clearStreamingContent();
        throw error;
      }
    },
    [currentChatId, addMessage, setIsStreaming, appendStreamingContent, clearStreamingContent, updateChat, queryClient]
  );

  const sendWithoutStream = useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      api.sendMessage(chatId, content),
    onMutate: ({ content }) => {
      // Optimistically add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMessage);
    },
    onSuccess: (data) => {
      addMessage(data.message);
    },
  });

  return { sendWithStream, sendWithoutStream };
}

export function useCompleteChat() {
  const queryClient = useQueryClient();
  const { updateChat } = useChatStore();

  return useMutation({
    mutationFn: api.completeChat,
    onSuccess: (data) => {
      updateChat(data.id, { status: 'completed' });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', data.id] });
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { removeChat, currentChatId, setCurrentChat, setMessages } = useChatStore();

  return useMutation({
    mutationFn: api.deleteChat,
    onSuccess: (_, chatId) => {
      removeChat(chatId);
      if (currentChatId === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

