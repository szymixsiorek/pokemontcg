
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
import Profile from "./pages/Profile";
import AuthError from "./pages/AuthError";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

const ThemeTransition = () => {
  useEffect(() => {
    document.body.classList.add('theme-transition');
    
    const removeEditButton = () => {
      const editButton = document.querySelector('a[href*="lovable.ai"]');
      if (editButton) {
        editButton.remove();
      }
    };
    
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
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
