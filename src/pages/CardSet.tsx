
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSetById, getUserCollection } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useRegion } from "@/context/RegionContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

const CardSet = () => {
  const { setId } = useParams<{ setId: string }>();
  const { language, t } = useLanguage();
  const { region } = useRegion();
  const { user } = useAuth();
  
  const { data: set, isLoading: isLoadingSet } = useQuery({
    queryKey: ['cardSet', setId],
    queryFn: () => getCardSetById(setId || ''),
    enabled: !!setId
  });
  
  const { data: collectionCards = [], isLoading: isLoadingCollection, refetch: refetchCollection } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => getUserCollection(user?.id || ''),
    enabled: !!user
  });
  
  const isLoading = isLoadingSet || (!!user && isLoadingCollection);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/sets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_sets")}
          </Link>
        </Button>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-button animate-spin mx-auto mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : set ? (
          <>
            <div className="mb-8 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold">
                  {language === "en" ? set.name : set.nameJp}
                </h1>
                <p className="text-muted-foreground">
                  {set.cardCount} {t("cards_in_set")} • {t("release_date")}: {set.releaseDate}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("series")}: {set.series}
                </p>
              </div>
              <img 
                src={set.logo} 
                alt={language === "en" ? set.name : set.nameJp}
                className="h-16 object-contain mx-auto md:mx-0" 
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {set.cards.map(card => (
                <PokemonCard 
                  key={card.id} 
                  card={card} 
                  inCollection={collectionCards.includes(card.id)}
                  onCollectionUpdate={refetchCollection}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{t("set_not_found")}</p>
            <Button asChild>
              <Link to="/sets">
                {t("back_to_sets")}
              </Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CardSet;
