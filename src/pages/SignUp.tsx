
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

// Simple interface to avoid deep type instantiation
interface SimpleProfile {
  id: string;
}

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const checkUsernameAvailability = async (value: string) => {
    if (!value) {
      setUsernameError(null);
      return;
    }
    
    // Check username format (letters, numbers, underscores only)
    if (!value.match(/^[a-zA-Z0-9_]+$/)) {
      setUsernameError("Username can only contain letters, numbers and underscores");
      return;
    }
    
    try {
      setCheckingUsername(true);
      
      // Using a more compatible approach with current Supabase types
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value)
        .limit(1);
        
      if (error) {
        console.error("Error checking username:", error);
        setUsernameError("Error checking username availability");
      } else if (data && data.length > 0) {
        // Username exists if we found any matches
        setUsernameError("Username already taken");
      } else {
        // No matches found, username is available
        setUsernameError(null);
      }
    } catch (error) {
      console.error("Error in checkUsernameAvailability:", error);
      setUsernameError("Error checking username availability");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleUsernameBlur = () => {
    if (username) {
      checkUsernameAvailability(username);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError(t("passwords_do_not_match"));
      return;
    }
    
    if (usernameError) {
      return;
    }
    
    setPasswordError("");
    const success = await signUp(email, password, displayName);
    if (success) {
      navigate("/");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("create_account")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("enter_details_to_register")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t("display_name")}</Label>
                <Input 
                  id="displayName" 
                  type="text" 
                  placeholder="Your Name" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose a unique username" 
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  className={usernameError ? "border-red-500" : ""}
                  required
                />
                {usernameError && (
                  <p className="text-destructive text-sm">{usernameError}</p>
                )}
                {checkingUsername && (
                  <p className="text-muted-foreground text-sm">Checking username availability...</p>
                )}
                <p className="text-muted-foreground text-sm">
                  Your username will be used for your public profile URL and must be unique.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("confirm_password")}</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-destructive text-sm">{passwordError}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || checkingUsername || !!usernameError}
              >
                {isLoading ? t("creating_account") : t("sign_up")}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("or_continue_with")}
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => signInWithGoogle()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-4 w-4 mr-2">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor"/>
                </svg>
                {t("sign_up_with_google")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm mt-2">
              {t("already_have_account")}{" "}
              <Link 
                to="/sign-in" 
                className="text-primary hover:underline"
              >
                {t("sign_in")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
