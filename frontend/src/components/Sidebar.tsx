import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Menu,
  X,
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
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-[#0f1419] border-r border-[#2a3441]
          flex flex-col
          transition-all duration-300
          ${isCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a3441]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-white font-semibold text-lg">Codex</span>
            )}
          </Link>
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-[#1a2332] text-slate-400 hover:text-white transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a2332] text-slate-300 hover:text-white transition-colors"
          >
            <Home size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
          >
            <Plus size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#2a3441]" />

        {/* Chat Lists */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Active Chats */}
              {activeChats.length > 0 && (
                <div className="mb-4">
                  {!isCollapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 uppercase">
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
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 uppercase">
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

              {/* Empty State */}
              {chats.length === 0 && !isCollapsed && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1a2332] flex items-center justify-center">
                    <MessageSquare size={20} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-400">No conversations yet</p>
                  <p className="text-xs text-slate-500 mt-1">Select a prompt to start</p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={toggle}
        className={`
          fixed top-4 left-4 z-50 p-2 rounded-lg 
          bg-[#0f1419] border border-[#2a3441]
          text-slate-400 hover:text-white
          transition-all lg:hidden
          ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
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
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-left group
        transition-colors
        ${isActive 
          ? 'bg-violet-600/20 border border-violet-600/30 text-violet-300' 
          : 'hover:bg-[#1a2332] text-slate-400 hover:text-slate-200'
        }
      `}
    >
      <MessageSquare size={16} className="flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm truncate">{chat.promptName}</span>
          <button
            onClick={(e) => onDelete(e, chat.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </>
      )}
    </button>
  );
}
