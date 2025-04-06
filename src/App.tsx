
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CardSets from "./pages/CardSets";
import CardSet from "./pages/CardSet";
import MyCollection from "./pages/MyCollection";
import AuthError from "./pages/AuthError";
import Donate from "./pages/Donate";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

// Add theme transition class to body
const ThemeTransition = () => {
  useEffect(() => {
    document.body.classList.add('theme-transition');
    
    // Try to remove the "edit with lovable" button if it exists
    const removeEditButton = () => {
      const editButton = document.querySelector('a[href*="lovable.ai"]');
      if (editButton) {
        editButton.remove();
      }
    };
    
    // Run initially and set up a MutationObserver to keep checking
    removeEditButton();
    const observer = new MutationObserver(removeEditButton);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      document.body.classList.remove('theme-transition');
      observer.disconnect();
    };
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <ThemeTransition />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth-error" element={<AuthError />} />
                <Route path="/sets" element={<CardSets />} />
                <Route path="/sets/:setId" element={<CardSet />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/my-collection" element={
                  <ProtectedRoute>
                    <MyCollection />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
