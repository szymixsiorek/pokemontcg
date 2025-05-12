
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSetById, getUserCollection } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Progress } from "@/components/ui/progress";

const CardSet = () => {
  const { setId } = useParams<{ setId: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { getSeriesColors } = useTheme();
  const [logoError, setLogoError] = useState(false);
  
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
  
  const handleLogoError = () => {
    setLogoError(true);
  };

  // Get series colors if set is available
  const seriesColors = set ? getSeriesColors(set.series) : { primary: "", secondary: "" };
  
  // Calculate collection progress
  const collectedCardsCount = set?.cards 
    ? set.cards.filter(card => collectionCards.includes(card.id)).length
    : 0;
  
  const totalCardsCount = set?.cardCount || 0;
  const collectionPercentage = totalCardsCount > 0 
    ? Math.round((collectedCardsCount / totalCardsCount) * 100)
    : 0;
  
  // Sort cards by card number
  const sortedCards = set?.cards 
    ? [...set.cards].sort((a, b) => {
        // Extract numeric parts from card numbers
        const aMatch = a.number.match(/^(\d+)/);
        const bMatch = b.number.match(/^(\d+)/);
        
        // If both have numeric parts, compare them as numbers
        if (aMatch && bMatch) {
          const aNum = parseInt(aMatch[1]);
          const bNum = parseInt(bMatch[1]);
          return aNum - bNum;
        }
        
        // Otherwise, use string comparison
        return a.number.localeCompare(b.number);
      })
    : [];
  
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
            <div className="pokeball-loader mx-auto mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : set ? (
          <>
            <div className="mb-8 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold">
                  {set.name}
                </h1>
                <p className="text-muted-foreground">
                  {set.cardCount} {t("cards_in_set")} • {t("release_date")}: {set.releaseDate}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("series")}: <span className="dark:text-white text-black">{set.series}</span>
                </p>
              </div>
              <div className="h-16 flex items-center justify-center md:justify-end">
                {!logoError ? (
                  <img 
                    src={set.logo} 
                    alt={set.name}
                    className="max-h-full object-contain"
                    onError={handleLogoError}
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {t("logo_not_available")}
                  </div>
                )}
              </div>
            </div>
            
            {user && (
              <div className="mb-6 bg-card p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {t("collection_progress")}
                  </span>
                  <span className="text-sm">
                    {collectedCardsCount} / {totalCardsCount} ({collectionPercentage}%)
                  </span>
                </div>
                <Progress value={collectionPercentage} className="h-2" />
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedCards.map(card => (
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
