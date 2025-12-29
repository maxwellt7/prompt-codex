import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';

export function Layout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <Sidebar />
      <main 
        className={`
          min-h-screen bg-[#0a0e14]
          transition-all duration-300
          lg:pl-64
          ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
