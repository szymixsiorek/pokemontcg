
import { useState, useEffect, useMemo } from "react";
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
import { Search, Library } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyCollection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "bySet">("all");
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  
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
  const allCards = useMemo(() => {
    return allSets.flatMap(set => set.cards);
  }, [allSets]);
  
  // Group collection cards by set
  const collectionBySet = useMemo(() => {
    const bySet: Record<string, { set: typeof allSets[0], cards: typeof allCards }> = {};
    
    // First, establish all sets that have cards in the collection
    for (const set of allSets) {
      const setCards = set.cards.filter(card => collectionCardIds.includes(card.id));
      if (setCards.length > 0) {
        bySet[set.id] = {
          set,
          cards: setCards
        };
      }
    }
    
    return bySet;
  }, [allSets, allCards, collectionCardIds]);
  
  // Filter collection cards based on search and selected set
  const filteredCollectionCards = useMemo(() => {
    let filtered = allCards.filter(card => 
      collectionCardIds.includes(card.id) && 
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (viewMode === "bySet" && selectedSet) {
      filtered = filtered.filter(card => card.setId === selectedSet);
    }
    
    return filtered;
  }, [allCards, collectionCardIds, searchQuery, viewMode, selectedSet]);
  
  const setsWithCards = useMemo(() => {
    return Object.values(collectionBySet)
      .map(({ set }) => set)
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }, [collectionBySet]);
  
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
          
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => {
              setViewMode(value as "all" | "bySet");
              if (value === "all") {
                setSelectedSet(null);
              } else if (setsWithCards.length > 0 && !selectedSet) {
                setSelectedSet(setsWithCards[0].id);
              }
            }}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">{t("all_cards")}</TabsTrigger>
              <TabsTrigger value="bySet">{t("by_set")}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="text-sm text-muted-foreground ml-auto">
            {filteredCollectionCards.length} {t("cards_collected")}
          </div>
        </div>
        
        {/* Set selector (only shown when in "bySet" view) */}
        {viewMode === "bySet" && (
          <div className="mb-6">
            <Select 
              value={selectedSet || ''} 
              onValueChange={setSelectedSet}
              disabled={setsWithCards.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder={t("select_set")} />
              </SelectTrigger>
              <SelectContent>
                {setsWithCards.map(set => (
                  <SelectItem key={set.id} value={set.id}>
                    {set.name} ({collectionBySet[set.id]?.cards.length || 0} {t("cards")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-button animate-spin mx-auto mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : filteredCollectionCards.length === 0 ? (
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
            {filteredCollectionCards.map(card => (
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
