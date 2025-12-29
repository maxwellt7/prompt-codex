import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Trash2, 
  CheckCircle,
  Clock,
  Plus,
  Sparkles
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useSidebarStore } from '../store/sidebarStore';
import { useChats, useDeleteChat } from '../hooks/useChat';

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
    <aside
      className={`
        fixed left-0 top-0 h-full z-50
        bg-slate-900
        border-r border-slate-800
        shadow-2xl shadow-black/50
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white">
                  Codex
                </span>
                <p className="text-xs text-slate-400">AI Prompts</p>
              </div>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Sparkles size={20} className="text-white" />
            </div>
          )}
        </div>
        
        <button
          onClick={toggle}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-2">
        <Link
          to="/"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl
            bg-slate-800/50 hover:bg-slate-700/50 
            text-slate-300 hover:text-white
            transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <Home size={18} />
          {!isCollapsed && <span className="font-medium">Home</span>}
        </Link>
        
        <button
          onClick={() => navigate('/')}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            bg-gradient-to-r from-emerald-500/20 to-teal-500/20
            border border-emerald-500/30
            text-emerald-400 hover:text-emerald-300
            hover:from-emerald-500/30 hover:to-teal-500/30
            transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <Plus size={18} />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </button>
      </div>

      {/* Divider */}
      <div className="px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Active Chats */}
            {activeChats.length > 0 && (
              <div className="mb-4">
                {!isCollapsed && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <MessageSquare size={24} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-400 font-medium">No conversations yet</p>
                <p className="text-xs text-slate-500 mt-1">Start by selecting a prompt</p>
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
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5
        transition-all duration-200 group text-left
        ${isActive 
          ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300' 
          : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <MessageSquare size={16} className="flex-shrink-0" />
      
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{chat.promptName}</p>
            {chat.messageCount && (
              <p className="text-xs text-slate-500">
                {chat.messageCount} messages
              </p>
            )}
          </div>
          
          <button
            onClick={(e) => onDelete(e, chat.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </>
      )}
    </button>
  );
}
