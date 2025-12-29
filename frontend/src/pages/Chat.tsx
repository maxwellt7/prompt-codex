import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, Info, X } from 'lucide-react';
import { ChatMessage, StreamingMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { useChat, useSendMessage, useCompleteChat } from '../hooks/useChat';
import { useChatStore } from '../store/chatStore';

export function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const { data: chatData, isLoading } = useChat(chatId || null);
  const { sendWithStream } = useSendMessage();
  const completeChat = useCompleteChat();
  
  const { currentMessages, isStreaming, streamingContent } = useChatStore();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, streamingContent]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendWithStream(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleComplete = async () => {
    if (!chatId || !confirm('Mark this conversation as complete? It will be saved to your knowledge base.')) {
      return;
    }

    try {
      await completeChat.mutateAsync(chatId);
    } catch (error) {
      console.error('Failed to complete chat:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-accent-teal animate-spin mx-auto mb-4" />
          <p className="text-midnight-300">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-midnight-300 mb-4">Conversation not found</p>
          <Link to="/" className="text-accent-teal hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = chatData.status === 'completed';

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-midnight-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg hover:bg-midnight-700/50 text-midnight-400 hover:text-midnight-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div>
              <h1 className="text-xl font-display font-semibold text-midnight-50">
                {chatData.promptName}
              </h1>
              <p className="text-sm text-midnight-400">
                {chatData.category} • {currentMessages.length} messages
                {isCompleted && ' • Completed'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg hover:bg-midnight-700/50 text-midnight-400 hover:text-midnight-200 transition-colors"
            >
              <Info size={20} />
            </button>

            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={completeChat.isPending || currentMessages.length < 2}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-accent-teal/20 text-accent-teal
                  hover:bg-accent-teal/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {completeChat.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                Complete
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="glass-light border-b border-midnight-700/50 px-6 py-4 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-midnight-100 mb-2">About this prompt</h3>
              <p className="text-sm text-midnight-300 max-w-2xl">
                This conversation uses the <strong>{chatData.promptName}</strong> prompt 
                from the <strong>{chatData.category}</strong> category. The AI has been 
                configured with a specialized system prompt to guide the conversation.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 hover:bg-midnight-700/50 rounded"
            >
              <X size={16} className="text-midnight-400" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {currentMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isStreaming && (
            <StreamingMessage content={streamingContent} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-midnight-700/50">
        <div className="max-w-4xl mx-auto">
          {isCompleted ? (
            <div className="text-center py-4">
              <p className="text-midnight-400 mb-2">
                This conversation has been completed and saved.
              </p>
              <Link 
                to="/" 
                className="text-accent-teal hover:underline"
              >
                Start a new conversation
              </Link>
            </div>
          ) : (
            <ChatInput
              onSend={handleSendMessage}
              disabled={isStreaming}
              placeholder="Type your message..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

