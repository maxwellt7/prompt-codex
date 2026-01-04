import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Menu,
  X,
  Home, 
  Trash2, 
  Clock,
  Plus,
  Sparkles,
  Archive
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useSidebarStore } from '../store/sidebarStore';
import { useChats, useDeleteChat } from '../hooks/useChat';
import { AuthButton } from './AuthButton';
import { cn } from '../lib/utils';

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();
  const navigate = useNavigate();
  const { chats, currentChatId } = useChatStore();
  const { isLoading } = useChats();
  const deleteChat = useDeleteChat();

  const activeChats = chats.filter(c => c.status === 'active');
  const completedChats = chats.filter(c => c.status === 'completed');

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Delete this conversation?')) {
      deleteChat.mutate(chatId);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-50",
          "bg-card/50 backdrop-blur-md border-r border-border/50",
          "flex flex-col transition-all duration-300",
          isCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(199,89%,48%)] to-[hsl(262,83%,58%)] flex items-center justify-center flex-shrink-0 glow-primary">
              <Sparkles size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-foreground font-semibold text-lg">Codex</span>
            )}
          </Link>
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-border/50" />

        {/* Chat Lists */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Active Chats */}
              {activeChats.length > 0 && (
                <div className="mb-4">
                  {!isCollapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <MessageSquare size={12} />
                      Active Chats
                    </div>
                  )}
                  {activeChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === currentChatId}
                      isCollapsed={isCollapsed}
                      onDelete={handleDelete}
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* Completed Chats */}
              {completedChats.length > 0 && (
                <div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <Archive size={12} />
                      Archived
                    </div>
                  )}
                  {completedChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === currentChatId}
                      isCollapsed={isCollapsed}
                      onDelete={handleDelete}
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {chats.length === 0 && !isCollapsed && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                    <MessageSquare size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Select a prompt to start</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* User section at bottom */}
        <div className="p-3 border-t border-border/50">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-start px-2"
          )}>
            <AuthButton />
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={toggle}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-lg",
          "bg-card/80 backdrop-blur-md border border-border/50",
          "text-muted-foreground hover:text-foreground",
          "transition-all lg:hidden",
          isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <Menu size={20} />
      </button>
    </>
  );
}

interface ChatItemProps {
  chat: {
    id: string;
    promptName: string;
    status: string;
    messageCount?: number;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
}

function ChatItem({ chat, isActive, isCollapsed, onDelete, onClick }: ChatItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg mb-1 text-left group transition-all",
        isActive 
          ? "bg-primary/10 border border-primary/30" 
          : "hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          isActive ? "bg-accent" : "bg-muted-foreground/30"
        )}
      />
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {chat.promptName}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} />
              {chat.messageCount || 0} messages
            </p>
          </div>
          <button
            onClick={(e) => onDelete(e, chat.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
          >
            <Trash2 size={14} className="text-destructive" />
          </button>
        </>
      )}
    </button>
  );
}
