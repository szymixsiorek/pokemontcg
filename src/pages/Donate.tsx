
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Donate = () => {
  const { t } = useLanguage();
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);

  useEffect(() => {
    // Initialize PayPal donation button when component mounts
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.charset = 'UTF-8';
    script.async = true;
    script.onload = () => {
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
        setIsPayPalLoading(false);
      }
    };
    document.body.appendChild(script);
    setIsPayPalLoading(true);

    // Initialize Stripe donation script
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    stripeScript.async = true;
    document.body.appendChild(stripeScript);

    return () => {
      // Clean up scripts when component unmounts
      document.body.removeChild(script);
      document.body.removeChild(stripeScript);
    };
  }, []);

  const handleStripeOneTimeDonation = () => {
    setIsStripeLoading(true);
    // @ts-ignore - Stripe is loaded from external script
    const stripe = window.Stripe('pk_live_51LnimeHWoJAZPYinhXzdXcXmvVxfDAcNTvyrK60OREhwxryuEoc1z2ncov4DV65mAPquXagzRhdwnw7CrKQmxmad00MKx5M0AG');
    stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1OthKSHWoJAZPYinZvPLnlmo', // Replace with your actual Stripe price ID
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: window.location.origin + '/donate?success=true',
      cancelUrl: window.location.origin + '/donate',
    }).then((result) => {
      if (result.error) {
        console.error(result.error.message);
      }
      setIsStripeLoading(false);
    });
  };

  const handleStripeMonthlyDonation = () => {
    setIsStripeLoading(true);
    // @ts-ignore - Stripe is loaded from external script
    const stripe = window.Stripe('pk_live_51LnimeHWoJAZPYinhXzdXcXmvVxfDAcNTvyrK60OREhwxryuEoc1z2ncov4DV65mAPquXagzRhdwnw7CrKQmxmad00MKx5M0AG');
    stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1OthKxHWoJAZPYinWwHD5SXV', // Replace with your actual Stripe subscription price ID
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: window.location.origin + '/donate?success=true',
      cancelUrl: window.location.origin + '/donate',
    }).then((result) => {
      if (result.error) {
        console.error(result.error.message);
      }
      setIsStripeLoading(false);
    });
  };

  // Check for success parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Show success message or toast
      alert('Thank you for your donation!');
      // Remove the success parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
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
              
              <Tabs defaultValue="stripe" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stripe">{t("donate_with_stripe")}</TabsTrigger>
                  <TabsTrigger value="paypal">{t("donate_with_paypal")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stripe" className="flex flex-col items-center space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                      className="flex-1" 
                      onClick={handleStripeOneTimeDonation} 
                      disabled={isStripeLoading}
                    >
                      {isStripeLoading ? t("loading") : t("donate_one_time")}
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="secondary" 
                      onClick={handleStripeMonthlyDonation}
                      disabled={isStripeLoading}
                    >
                      {isStripeLoading ? t("loading") : t("donate_monthly")}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center w-full pt-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                      alt="Stripe" 
                      className="h-8 object-contain" 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal" className="flex flex-col items-center space-y-4 pt-4">
                  {isPayPalLoading ? (
                    <div className="text-center py-4">{t("loading")}</div>
                  ) : (
                    <div id="donate-button-container" className="w-full flex justify-center">
                      <div id="donate-button"></div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
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
