import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function SignUp() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #a855f7)" }}
              >
                <Sparkles className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-bold text-foreground">Prompt Codex</span>
            </div>
            <p className="text-muted-foreground">Create an account to save your prompts and conversations</p>
          </div>
          
          <ClerkSignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-muted/30 border border-border/50 shadow-xl",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "bg-background border-border/50 text-foreground hover:bg-muted/50",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-background border-border/50 text-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}

