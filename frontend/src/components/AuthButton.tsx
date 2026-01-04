import { SignedIn, SignedOut, UserButton, useClerk } from '@clerk/clerk-react';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function AuthButton() {
  const navigate = useNavigate();
  
  // Check if Clerk is available
  try {
    const { loaded } = useClerk();
    if (!loaded) return null;
  } catch {
    // Clerk not configured, show nothing
    return null;
  }

  return (
    <>
      <SignedIn>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
              userButtonPopoverCard: "bg-background border border-border/50",
              userButtonPopoverActionButton: "text-foreground hover:bg-muted/50",
              userButtonPopoverActionButtonText: "text-foreground",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/sign-in')}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
          <Button 
            variant="glass" 
            size="sm"
            onClick={() => navigate('/sign-up')}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </Button>
        </div>
      </SignedOut>
    </>
  );
}

// Wrapper that handles when Clerk isn't configured
export function SafeAuthButton() {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkKey) {
    return null; // Don't show auth buttons if Clerk isn't configured
  }
  
  return <AuthButton />;
}

