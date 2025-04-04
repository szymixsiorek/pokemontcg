
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSets, getUserCollection } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MyCollection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);
  
  const { data: collectionCardIds = [], isLoading: isLoadingCollection, refetch: refetchCollection } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => getUserCollection(user?.id || ''),
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  const { data: allSets = [], isLoading: isLoadingSets } = useQuery({
    queryKey: ['cardSets'],
    queryFn: () => getCardSets(),
    enabled: !!user
  });
  
  // Collect all cards from all sets
  const allCards = allSets.flatMap(set => set.cards);
  
  // Filter collection cards
  const collectionCards = allCards.filter(card => 
    collectionCardIds.includes(card.id) && 
    (card.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const isLoading = isLoadingCollection || isLoadingSets;
  
  if (!user) {
    return null; // Redirect handled by useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">{t("my_collection")}</h1>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("search_cards")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {collectionCards.length} {t("cards_collected")}
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-button animate-spin mx-auto mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : collectionCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">
              {searchQuery 
                ? t("no_matching_cards") 
                : t("no_cards_in_collection")}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>
                {t("clear_search")}
              </Button>
            )}
            {!searchQuery && (
              <Button asChild>
                <a href="/sets">{t("browse_sets")}</a>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collectionCards.map(card => (
              <PokemonCard 
                key={card.id} 
                card={card} 
                inCollection={true}
                onCollectionUpdate={refetchCollection}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyCollection;
