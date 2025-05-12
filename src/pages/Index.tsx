
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSets } from "@/lib/api";
import { Button } from "@/components/ui/button";
import SetCard from "@/components/SetCard";
import Layout from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import PokemonCard from "@/components/PokemonCard";
import CardNameTypeahead from "@/components/CardNameTypeahead";
import { toast } from "sonner";
import { useCardSearch, CardGroup } from "@/hooks/useCardSearch";
import CardDisplayOptions, { DisplayMode, SortOrder } from "@/components/CardDisplayOptions";

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CardGroup[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  // Display and sorting options - changed default displayMode to "all" instead of "grouped"
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest-first");
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  
  // Use our custom hook for card search functionality
  const { searchCardsByPokemon, formatPokemonName } = useCardSearch();
  
  // Get card sets
  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['cardSets'],
    queryFn: () => getCardSets()
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
  
  // Extract available sets from search results for filtering
  const availableSets = useMemo(() => {
    return searchResults.map(group => ({
      id: group.set.id,
      name: group.set.name
    }));
  }, [searchResults]);
  
  // Process search results based on display mode, sort order, and filters
  const processedResults = useMemo(() => {
    if (searchResults.length === 0) return { groupedResults: [], allCards: [] };
    
    // Apply set filter if needed
    let filteredGroups = searchResults;
    if (selectedSetId) {
      filteredGroups = searchResults.filter(group => group.set.id === selectedSetId);
    }
    
    // Apply sort order
    let sortedGroups = [...filteredGroups];
    if (sortOrder === "newest-first") {
      // Reverse the order (since they're already sorted oldest-first)
      sortedGroups = sortedGroups.reverse();
    }
    
    // Extract all cards for "all cards" view
    const allCards = sortedGroups.flatMap(group => group.cards);
    
    return { groupedResults: sortedGroups, allCards };
  }, [searchResults, sortOrder, selectedSetId]);
  
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setIsLoadingResults(true);
      
      try {
        // Clean up the name for searching - remove display formatting
        const searchName = searchQuery.toLowerCase().replace(/\s+/g, '-');
        console.log(`Searching for cards with name: ${searchName}`);
        
        // Search for cards using the searchCardsByPokemon function
        const { groupedCards } = await searchCardsByPokemon(searchName);
        setSearchResults(groupedCards);
        
        // Reset filtering and sorting options
        setSelectedSetId(null);
        
        // Calculate total cards across all groups
        const totalCards = groupedCards.reduce((sum, group) => sum + group.cards.length, 0);
        
        if (totalCards > 0) {
          toast.success(`Found ${totalCards} cards for ${formatPokemonName(searchName)}`);
        } else {
          toast.info(`No cards found for ${formatPokemonName(searchName)}`);
        }
      } catch (error) {
        console.error("Error searching for cards:", error);
        toast.error(`Error searching for ${searchQuery} cards`);
        setSearchResults([]);
      } finally {
        setIsLoadingResults(false);
      }
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };
  
  // Updated to handle Pokemon name selection with proper formatting
  const handleCardSelect = async (card: { id: string; name: string }) => {
    // Use the raw name for API search but formatted name for display
    const rawName = card.name;
    const displayName = formatPokemonName(rawName);
    
    // Set the formatted name as the search query for better user experience
    setSearchQuery(displayName);
    setIsSearching(true);
    setIsLoadingResults(true);
    
    try {
      console.log(`Searching for cards of Pokémon: ${rawName} (display: ${displayName})`);
      const { groupedCards } = await searchCardsByPokemon(rawName);
      
      // Calculate total cards across all groups
      const totalCards = groupedCards.reduce((sum, group) => sum + group.cards.length, 0);
      console.log(`Found ${totalCards} results for ${displayName} across ${groupedCards.length} sets`);
      
      setSearchResults(groupedCards);
      
      if (totalCards > 0) {
        toast.success(`Found ${totalCards} cards for ${displayName}`);
      } else {
        toast.info(`No cards found for ${displayName}`);
      }
    } catch (error) {
      console.error("Error searching for cards:", error);
      toast.error(`Error searching for ${displayName} cards`);
      setSearchResults([]);
    } finally {
      setIsLoadingResults(false);
    }
  };
  
  // The sets are already sorted by release date in the API
  const latestSets = sets.slice(0, 3);
  
  return (
    <Layout>
      {/* Hero section with search - adjusted with balanced spacing */}
      <section className="px-4 sm:px-6 lg:px-8 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6 pt-12">
            <img 
              src="https://i.postimg.cc/xjWWBNCG/Projekt-bez-nazwy-1.png" 
              alt="Pokémon TCG Gallery"
              className="max-w-md w-full h-auto object-contain" 
            />
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("welcome_subtitle")}
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <CardNameTypeahead 
              onSelect={handleCardSelect}
              placeholder={t("search_pokemon_cards")}
            />
          </div>
          
          <Button asChild size="lg" className="mb-16">
            <Link to="/sets">
              {t("explore_sets")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Search Results - Updated to support different display modes */}
      {isSearching && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t("search_results")}</h2>
              <Button variant="ghost" onClick={clearSearch}>
                {t("clear_search")}
              </Button>
            </div>
            
            {isLoadingResults ? (
              <div className="text-center py-12">
                <div className="pokeball-loader mx-auto mb-4" />
                <p>{t("loading")}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p>{t("no_results")}</p>
              </div>
            ) : (
              <>
                {/* Display and sorting options */}
                <div className="mb-8 p-4 border rounded-md bg-card">
                  <CardDisplayOptions 
                    displayMode={displayMode}
                    setDisplayMode={setDisplayMode}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    availableSets={availableSets}
                    selectedSetId={selectedSetId}
                    setSelectedSetId={setSelectedSetId}
                  />
                </div>
                
                {/* Render cards based on display mode */}
                {displayMode === "grouped" ? (
                  // Grouped by set mode
                  <div className="space-y-12">
                    {processedResults.groupedResults.map(group => (
                      <div key={group.set.id} className="border-t pt-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold">
                            <Link to={`/sets/${group.set.id}`} className="hover:underline text-primary">
                              {group.set.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {group.cards.length} {group.cards.length === 1 ? 'card' : 'cards'}
                            {group.set.releaseDate && ` • ${group.set.releaseDate}`}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {group.cards.map(card => (
                            <PokemonCard key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // All cards mode
                  <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {processedResults.allCards.length} {processedResults.allCards.length === 1 ? 'card' : 'cards'} found
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {processedResults.allCards.map(card => (
                        <PokemonCard key={card.id} card={card} />
                      ))}
                    </div>
                  </div>
                )}
              </>
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
      
      {/* Sets of the Day section */}
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
    </Layout>
  );
};

export default Index;
