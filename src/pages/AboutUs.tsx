
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const AboutUs = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Load CommonNinja script
    const script = document.createElement('script');
    script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    script.defer = true;
    
    // Check if script already exists to avoid duplicates
    if (!document.querySelector('script[src="https://cdn.commoninja.com/sdk/latest/commonninja.js"]')) {
      document.body.appendChild(script);
    }
    
    return () => {
      // Clean up script when component unmounts if we added it
      const existingScript = document.querySelector('script[src="https://cdn.commoninja.com/sdk/latest/commonninja.js"]');
      if (existingScript && existingScript !== script) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">{t("about_us")}</h1>
          <p className="text-center mb-12 text-muted-foreground">
            Learn more about the Pokémon TCG Gallery project
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{t("site_creation")}</CardTitle>
                <CardDescription>The people behind this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("created_by")}</span>
                  <span className="font-medium">Szymix</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("launch_date")}</span>
                  <span className="font-medium">April 2, 2025</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground mb-3">{t("days_online")}</span>
                  {/* CommonNinja Countdown Timer Component */}
                  <div className="commonninja_component pid-72159105-07e6-4d74-b025-832a33654cc5"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("tech_stack")}</CardTitle>
                <CardDescription>Technologies used in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-600">React</Badge>
                  <Badge className="bg-gray-700">TypeScript</Badge>
                  <Badge className="bg-cyan-600">Tailwind CSS</Badge>
                  <Badge className="bg-emerald-600">Supabase</Badge>
                  <Badge className="bg-purple-600">shadcn/ui</Badge>
                  <Badge className="bg-orange-600">Vite</Badge>
                  <Badge className="bg-green-600">Tanstack Query</Badge>
                  <Badge className="bg-red-600">Lucide Icons</Badge>
                  <Badge className="bg-blue-800">Stripe</Badge>
                  <Badge className="bg-teal-600">Resend</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>{t("our_story")}</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p>
                The Pokémon TCG Gallery project was born from a passion for Pokémon trading cards and a desire to create a helpful resource for collectors and players alike. As a collector myself, I wanted to build a platform that would make it easy to browse, search, and track cards in the ever-expanding Pokémon TCG universe.
              </p>
              <p>
                What started as a personal project quickly grew into something larger, as I realized there was a need for a modern, user-friendly tool that could help people manage their collections and discover new cards. The site was officially launched in April 2025 and has been growing steadily since.
              </p>
              <p>
                The design philosophy behind Pokémon TCG Gallery is simplicity and functionality. I wanted to create an interface that would be intuitive for users of all ages, while still offering powerful features for serious collectors.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t("project_description")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pokémon TCG Gallery is a comprehensive online resource for Pokémon Trading Card Game enthusiasts. The site offers a detailed database of cards across all sets, enabling users to:
                </p>
                <ul className="mt-4 space-y-2 list-disc pl-5">
                  <li>Browse complete card sets from across the Pokémon TCG history</li>
                  <li>Search for specific cards by name, type, and more</li>
                  <li>Track market prices from TCGPlayer and Cardmarket</li>
                  <li>Create and manage personal card collections</li>
                  <li>View high-resolution card images</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("project_purpose")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The core mission of Pokémon TCG Gallery is to make collecting Pokémon cards more accessible and enjoyable for everyone. Whether you're a seasoned collector with thousands of cards or just starting your journey into the world of Pokémon TCG, our tools are designed to enhance your experience.
                </p>
                <p className="text-muted-foreground mt-4">
                  This project is built with love and is sustained by the support of the community. Your donations help keep the site running and allow for continued development of new features and improvements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
