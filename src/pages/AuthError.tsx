
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AuthError = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  
  useEffect(() => {
    // If there's no error, redirect to home
    if (!error && !errorCode && !errorDescription) {
      navigate("/");
    }
  }, [error, errorCode, errorDescription, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{t("auth_error")}</AlertTitle>
            <AlertDescription>
              {errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, " ")) : t("link_expired")}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-4">
            <p className="text-center text-muted-foreground">
              {t("try_again_or_contact")}
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate("/sign-in")}
              >
                {t("sign_in")}
              </Button>
              
              <Button 
                onClick={() => navigate("/")}
              >
                {t("home")}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthError;
