import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';

export function Layout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main 
        className={`
          min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'ml-20' : 'ml-72'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
