
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Donate = () => {
  const { t } = useLanguage();
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PayPal donation button
    if (!document.querySelector('script[src*="paypalobjects.com/donate"]')) {
      const paypalScript = document.createElement('script');
      paypalScript.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      paypalScript.charset = 'UTF-8';
      
      paypalScript.onload = () => {
        if (window.PayPal && window.PayPal.Donation && paypalButtonContainerRef.current) {
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
      
      return () => {
        if (document.body.contains(paypalScript)) {
          document.body.removeChild(paypalScript);
        }
      };
    }
  }, []);
  
  useEffect(() => {
    // Stripe donation button
    if (!document.querySelector('script[src*="js.stripe.com/v3/buy-button.js"]')) {
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
      stripeScript.async = true;
      document.body.appendChild(stripeScript);
      
      return () => {
        if (document.body.contains(stripeScript)) {
          document.body.removeChild(stripeScript);
        }
      };
    }
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-8">
                <div className="flex flex-col items-center border p-6 rounded-md bg-white">
                  <h3 className="text-xl font-semibold mb-4">Stripe</h3>
                  <div className="w-full flex justify-center">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1RKeYhCEmRGIM1ZIOGp8i4fK"
                      publishable-key="pk_live_51IVE1tCEmRGIM1ZIQCcBiNzVHBeaw89SEqF2q61v3xnN7IXwZrkb8yiAna73uWMTybqIkzQjXUU8geMwQRUI4O5y00nk54TyzJ"
                    >
                    </stripe-buy-button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center border p-6 rounded-md bg-gray-50">
                  <h3 className="text-xl font-semibold mb-4">PayPal</h3>
                  <div ref={paypalButtonContainerRef} className="w-full flex justify-center">
                    <div id="donate-button"></div>
                  </div>
                </div>
              </div>
              
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
