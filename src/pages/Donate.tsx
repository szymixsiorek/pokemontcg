
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Donate = () => {
  const { t } = useLanguage();
  const [isPayPalLoading, setIsPayPalLoading] = useState(true);

  useEffect(() => {
    // Initialize PayPal donation button
    const setupPayPal = () => {
      const paypalContainer = document.getElementById('paypal-container');
      if (paypalContainer) {
        // Clear any existing content in the container
        paypalContainer.innerHTML = `
          <div id="donate-button-container">
            <div id="donate-button"></div>
            <script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" charset="UTF-8"></script>
            <script>
              PayPal.Donation.Button({
                env:'production',
                hosted_button_id:'V7AZFU7U7WW4E',
                image: {
                  src:'https://pics.paypal.com/00/s/YWEzMjVhMWYtN2U1Ni00ZDUwLTliZWMtZmVmOTc0ZGY2MzRk/file.PNG',
                  alt:'Donate with PayPal button',
                  title:'PayPal - The safer, easier way to pay online!',
                }
              }).render('#donate-button');
            </script>
          </div>
        `;
        setIsPayPalLoading(false);
      }
    };
    
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      setupPayPal();
    }, 500);
    
    return () => {
      // Clean up timer when component unmounts
      clearTimeout(timer);
    };
  }, []);

  // Check for success parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Show success message using toast
      toast({
        title: t("donation_success"),
        description: t("donation_thanks_message"),
      });
      // Remove the success parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">{t("support_project")}</CardTitle>
              <CardDescription className="text-lg mt-2">{t("donation_subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-center mb-8 text-muted-foreground">{t("donation_description")}</p>
              
              {isPayPalLoading ? (
                <div className="text-center py-4">{t("loading")}</div>
              ) : (
                <div className="w-full flex justify-center">
                  <div id="paypal-container" className="paypal-button-container"></div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
                <Card className="border-primary/20">
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{t("development")}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    {t("development_help")}
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{t("hosting")}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    {t("hosting_help")}
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{t("new_features")}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    {t("features_help")}
                  </CardContent>
                </Card>
              </div>
              
              <p className="mt-10 text-center text-sm text-muted-foreground">
                {t("donation_thanks")}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donate;
