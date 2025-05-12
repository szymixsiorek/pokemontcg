import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSets, searchCardsByName } from "@/lib/api";
import { Button } from "@/components/ui/button";
import SetCard from "@/components/SetCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useMemo } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import PokemonCard from "@/components/PokemonCard";
import CardSearchExample from "@/components/CardSearchExample";

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Get card sets
  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['cardSets'],
    queryFn: () => getCardSets()
  });
  
  // Search results query
  const { data: searchResults = [], isLoading: isLoadingSearch, refetch: refetchSearch } = useQuery({
    queryKey: ['searchCards', searchQuery],
    queryFn: () => searchCardsByName(searchQuery),
    enabled: false
  });
  
  // Generate daily sets selection based on current date
  const setsOfTheDay = useMemo(() => {
    if (sets.length === 0) return [];
    
    // Use the current date as a seed for "randomness"
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Use the date seed to select 3 different sets
    const selectedSets = [];
    let availableSets = [...sets];
    
    for (let i = 0; i < 3; i++) {
      if (availableSets.length === 0) break;
      
      // Use the date seed and the current iteration to get a deterministic "random" index
      const index = (dateSeed + i * 100) % availableSets.length;
      selectedSets.push(availableSets[index]);
      
      // Remove the selected set from available sets to prevent duplicates
      availableSets = [...availableSets.slice(0, index), ...availableSets.slice(index + 1)];
    }
    
    return selectedSets;
  }, [sets]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      await refetchSearch();
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };
  
  // The sets are already sorted by release date in the API
  const latestSets = sets.slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen theme-transition">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section with typeahead search */}
        <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-primary/10`}>
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="https://i.postimg.cc/xjWWBNCG/Projekt-bez-nazwy-1.png" 
                alt="Pokémon TCG Gallery"
                className="max-w-md w-full h-auto object-contain" 
              />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("welcome_subtitle")}
            </p>
            
            {/* Card Search Example with Typeahead */}
            <div className="max-w-md mx-auto mb-8">
              <CardSearchExample />
            </div>
            
            <Button asChild size="lg">
              <Link to="/sets">
                {t("explore_sets")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Search Results */}
        {isSearching && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{t("search_results")}</h2>
                <Button variant="ghost" onClick={clearSearch}>
                  {t("clear_search")}
                </Button>
              </div>
              
              {isLoadingSearch ? (
                <div className="text-center py-12">
                  <div className="pokeball-loader mx-auto mb-4" />
                  <p>{t("loading")}</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p>{t("no_results")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map(card => (
                    <PokemonCard key={card.id} card={card} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Latest sets section - only show if not searching */}
        {!isSearching && (
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
                  <div className="pokeball-loader mx-auto mb-4" />
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
        )}
        
        {/* Sets of the Day section - updated from Popular sets */}
        {!isSearching && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{t("sets_of_the_day")}</h2>
                <Button variant="ghost" asChild>
                  <Link to="/sets">
                    {t("view_all")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="pokeball-loader mx-auto mb-4" />
                  <p>{t("loading")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {setsOfTheDay.map(set => (
                    <SetCard key={set.id} set={set} />
                  ))}
                </div>
              )}
              
              <div className="text-center mt-8 text-sm text-muted-foreground">
                <p>New sets featured daily. Check back tomorrow for new recommendations!</p>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
