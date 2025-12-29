import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, Info, X, Sparkles } from 'lucide-react';
import { ChatMessage, StreamingMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { useChat, useSendMessage, useCompleteChat } from '../hooks/useChat';
import { useChatStore } from '../store/chatStore';
import { cn } from '../lib/utils';

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
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Conversation not found</p>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = chatData.status === 'completed';

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(262,83%,58%)] flex items-center justify-center glow-primary">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {chatData.promptName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {chatData.category} • {currentMessages.length} messages
                  {isCompleted && (
                    <span className="ml-2 text-accent">• Completed</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                showInfo 
                  ? 'bg-muted text-foreground' 
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Info size={18} />
            </button>

            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={completeChat.isPending || currentMessages.length < 2}
                className="
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-accent/20 text-accent border border-accent/30
                  hover:bg-accent/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {completeChat.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                <span className="font-medium">Complete</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-muted/30 border-b border-border/50 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-2">About this prompt</h3>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                This conversation uses the <strong className="text-foreground">{chatData.promptName}</strong> prompt 
                from the <strong className="text-foreground">{chatData.category}</strong> category. The AI has been 
                configured with a specialized system prompt to guide the conversation.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {currentMessages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(199,89%,48%)]/20 to-[hsl(262,83%,58%)]/20 flex items-center justify-center border border-primary/30 glow-primary">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Start the conversation</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Type a message below to begin your conversation with the AI using the {chatData.promptName} prompt.
              </p>
            </div>
          )}
          
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
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {isCompleted ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">
                This conversation has been completed and saved.
              </p>
              <Link 
                to="/" 
                className="text-primary hover:underline font-medium"
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
