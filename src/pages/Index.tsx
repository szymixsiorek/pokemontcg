
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSets } from "@/lib/api";
import { Button } from "@/components/ui/button";
import SetCard from "@/components/SetCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const { data: sets, isLoading } = useQuery({
    queryKey: ['cardSets'],
    queryFn: () => getCardSets()
  });
  
  const latestSets = sets?.slice(0, 3) || [];
  const popularSets = sets?.slice(2, 5) || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-primary/10`}>
          <div className="container mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6" 
                style={{ color: "#3B4CCA", WebkitTextStroke: "2px #FFCB05" }}>
              {t("welcome")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("welcome_subtitle")}
            </p>
            <Button asChild size="lg">
              <Link to="/sets">
                {t("explore_sets")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Latest sets section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t("latest_sets")}</h2>
              <Button variant="ghost" asChild>
                <Link to="/sets">
                  {t("view_all")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="pokeball-button animate-spin mx-auto mb-4" />
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {latestSets.map(set => (
                  <SetCard key={set.id} set={set} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Popular sets section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t("popular_sets")}</h2>
              <Button variant="ghost" asChild>
                <Link to="/sets">
                  {t("view_all")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="pokeball-button animate-spin mx-auto mb-4" />
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {popularSets.map(set => (
                  <SetCard key={set.id} set={set} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
