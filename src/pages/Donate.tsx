
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Donate = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Initialize PayPal donation button when component mounts
    const paypalScript = document.createElement('script');
    paypalScript.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    paypalScript.charset = 'UTF-8';
    paypalScript.async = true;
    paypalScript.onload = () => {
      // @ts-ignore - PayPal is loaded from external script
      if (window.PayPal && window.PayPal.Donation) {
        // @ts-ignore - PayPal is loaded from external script
        window.PayPal.Donation.Button({
          env: 'production',
          hosted_button_id: 'V7AZFU7U7WW4E',
          image: {
            src: 'https://pics.paypal.com/00/s/YWEzMjVhMWYtN2U1Ni00ZDUwLTliZWMtZmVmOTc0ZGY2MzRk/file.PNG',
            alt: 'Donate with PayPal button',
            title: 'PayPal - The safer, easier way to pay online!',
          }
        }).render('#donate-button');
      }
    };
    document.body.appendChild(paypalScript);
    
    // Initialize Stripe donation button
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
    stripeScript.async = true;
    document.body.appendChild(stripeScript);

    return () => {
      // Clean up scripts when component unmounts
      document.body.removeChild(paypalScript);
      document.body.removeChild(stripeScript);
    };
  }, []);

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
              
              <Tabs defaultValue="stripe" className="w-full max-w-md mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stripe">Stripe</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                <TabsContent value="stripe" className="flex justify-center pt-4">
                  <div id="stripe-button-container" className="w-full flex justify-center">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RKeYhCEmRGIM1ZIOGp8i4fK"
                      publishable-key="pk_live_51IVE1tCEmRGIM1ZIQCcBiNzVHBeaw89SEqF2q61v3xnN7IXwZrkb8yiAna73uWMTybqIkzQjXUU8geMwQRUI4O5y00nk54TyzJ"
                    >
                    </stripe-buy-button>
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="flex justify-center pt-4">
                  <div id="donate-button-container">
                    <div id="donate-button"></div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
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
