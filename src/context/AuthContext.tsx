import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { usernameFromEmail } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  username: string;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUsername: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle setup of username for Google sign-ins
  const setupGoogleUser = async (user: User) => {
    // Only proceed if this is a Google login and username isn't set
    if (!user.user_metadata?.username && user.app_metadata?.provider === 'google') {
      try {
        console.log("Setting up username for Google user");
        
        // Generate username from email
        const email = user.email || '';
        const generatedUsername = usernameFromEmail(email);
        
        if (generatedUsername) {
          // Check if username exists
          const { data: existingUser } = await (supabase as any)
            .from('profiles')
            .select('id')
            .eq('username', generatedUsername)
            .limit(1);
            
          // If username is taken, add a random number
          let finalUsername = generatedUsername;
          if (existingUser && existingUser.length > 0) {
            finalUsername = `${generatedUsername}${Math.floor(Math.random() * 1000)}`;
          }
          
          // Update user metadata with username
          const { error: updateError } = await supabase.auth.updateUser({
            data: { username: finalUsername }
          });
          
          if (updateError) {
            console.error("Error setting username for Google user:", updateError);
          } else {
            // Update username in profiles table
            await supabase
              .from('profiles')
              .upsert({ 
                id: user.id, 
                username: finalUsername,
                updated_at: new Date().toISOString()
              });
              
            setUsername(finalUsername);
            console.log("Username set for Google user:", finalUsername);
          }
        }
      } catch (error) {
        console.error("Error in setupGoogleUser:", error);
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Set username from metadata
          const userUsername = session.user.user_metadata?.username || "";
          setUsername(userUsername);
          
          // If this is a new Google sign-in, setup username
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            // Use setTimeout to prevent deadlocks in the auth callback
            setTimeout(() => {
              setupGoogleUser(session.user);
            }, 0);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Set username from metadata
        const userUsername = session.user.user_metadata?.username || "";
        setUsername(userUsername);
        
        // Check if we need to setup a username for Google user
        if (!userUsername && session.user.app_metadata?.provider === 'google') {
          setupGoogleUser(session.user);
        }
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return true;
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during Google sign in:", error);
      toast({
        title: "Google sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username // Store username in user metadata
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      return true;
    } catch (error) {
      console.error("Error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have successfully signed out.",
      });
      navigate('/');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for further instructions.",
      });
      return true;
    } catch (error) {
      console.error("Error during password reset:", error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsername = async (newUsername: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: newUsername }
      });
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      setUsername(newUsername);
      toast({
        title: "Profile updated",
        description: "Your username has been updated.",
      });
      return true;
    } catch (error) {
      console.error("Error updating username:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      username,
      signIn, 
      signInWithGoogle,
      signUp, 
      signOut, 
      resetPassword,
      updateUsername
    }}>
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
