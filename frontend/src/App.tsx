import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Chat } from './pages/Chat';
import { AllPrompts } from './pages/AllPrompts';
import { setAuthTokenGetter } from './api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { getToken } = useAuth();

  // Set up auth token getter for API client
  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/prompts" element={<AllPrompts />} />
        
        {/* Pages with sidebar */}
        <Route element={<Layout />}>
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="chat/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
