
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("pokemon-user");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("pokemon-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock authentication functions (to be replaced with actual auth)
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email && password) {
        // Simple validation for demo
        const mockUser: User = {
          id: "user-" + Date.now(),
          email,
          displayName: email.split('@')[0]
        };
        setUser(mockUser);
        localStorage.setItem("pokemon-user", JSON.stringify(mockUser));
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        return true;
      } 
      
      toast({
        title: "Sign in failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email && password) {
        // Simple validation for demo
        const mockUser: User = {
          id: "user-" + Date.now(),
          email,
          displayName: email.split('@')[0]
        };
        setUser(mockUser);
        localStorage.setItem("pokemon-user", JSON.stringify(mockUser));
        toast({
          title: "Account created!",
          description: "You have successfully created an account.",
        });
        return true;
      }
      
      toast({
        title: "Sign up failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem("pokemon-user");
    toast({
      title: "Signed out",
      description: "You have successfully signed out.",
    });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for further instructions.",
        });
        return true;
      }
      
      toast({
        title: "Password reset failed",
        description: "Invalid email",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "An error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
