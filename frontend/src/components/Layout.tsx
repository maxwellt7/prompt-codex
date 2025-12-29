import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';

export function Layout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main 
        className={`
          min-h-screen transition-all duration-300 ease-in-out bg-slate-950
          ${isCollapsed ? 'pl-20' : 'pl-72'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
