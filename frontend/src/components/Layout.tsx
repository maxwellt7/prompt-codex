import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';
import { cn } from '../lib/utils';

export function Layout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main 
        className={cn(
          "min-h-screen bg-background transition-all duration-300",
          "lg:pl-64",
          isCollapsed && "lg:pl-16"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
