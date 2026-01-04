import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Chat } from './pages/Chat';
import { AllPrompts } from './pages/AllPrompts';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/prompts" element={<AllPrompts />} />
          
          {/* Auth pages */}
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          
          {/* Pages with sidebar */}
          <Route element={<Layout />}>
            <Route path="category/:categoryId" element={<Category />} />
            <Route path="chat/:chatId" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
