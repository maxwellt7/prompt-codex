import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Trash2, 
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useChats, useDeleteChat } from '../hooks/useChat';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <aside
      className={`
        fixed left-0 top-0 h-full z-40
        glass border-r border-midnight-700/50
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'w-16' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-midnight-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-teal to-accent-violet flex items-center justify-center">
                <MessageSquare size={18} className="text-white" />
              </div>
              <span className="font-display text-lg font-semibold gradient-text">
                Codex
              </span>
            </Link>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-midnight-700/50 text-midnight-400 hover:text-midnight-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 border-b border-midnight-700/50">
        <Link
          to="/"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg
            hover:bg-midnight-700/50 text-midnight-300 hover:text-midnight-100
            transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <Home size={18} />
          {!isCollapsed && <span>Home</span>}
        </Link>
        
        <button
          onClick={() => navigate('/')}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg mt-1
            bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20
            transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <Plus size={18} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Active Chats */}
            {activeChats.length > 0 && (
              <div className="mb-4">
                {!isCollapsed && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-midnight-500 uppercase tracking-wider">
                    <Clock size={12} />
                    Active ({activeChats.length})
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
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-midnight-500 uppercase tracking-wider">
                    <CheckCircle size={12} />
                    Completed ({completedChats.length})
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

            {chats.length === 0 && !isCollapsed && (
              <div className="text-center py-8 text-midnight-500">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start by selecting a prompt</p>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
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
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1
        transition-colors group text-left
        ${isActive 
          ? 'bg-accent-violet/20 text-accent-violet' 
          : 'hover:bg-midnight-700/50 text-midnight-300 hover:text-midnight-100'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <MessageSquare size={16} className="flex-shrink-0" />
      
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{chat.promptName}</p>
            {chat.messageCount && (
              <p className="text-xs text-midnight-500">
                {chat.messageCount} messages
              </p>
            )}
          </div>
          
          <button
            onClick={(e) => onDelete(e, chat.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent-coral/20 rounded transition-all"
          >
            <Trash2 size={14} className="text-accent-coral" />
          </button>
        </>
      )}
    </button>
  );
}

