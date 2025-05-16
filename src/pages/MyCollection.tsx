import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSets, getUserCollection, getCardsByIds } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Library, TrendingUp, Award, Download, FilePdf, FileImage } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CollectionExports from "@/components/CollectionExports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MyCollection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "bySet">("all");
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);
  
  // First, fetch the IDs of cards in the user's collection
  const { data: collectionCardIds = [], isLoading: isLoadingIds, refetch: refetchCollection } = useQuery({
    queryKey: ['collection-ids', user?.id],
    queryFn: () => getUserCollection(user?.id || ''),
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Then, fetch the actual card data for those IDs
  const { data: collectionCards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ['collection-cards', collectionCardIds],
    queryFn: () => getCardsByIds(collectionCardIds),
    enabled: collectionCardIds.length > 0,
    refetchOnMount: true,
  });
  
  // Fetch all sets for grouping by set
  const { data: allSets = [], isLoading: isLoadingSets } = useQuery({
    queryKey: ['cardSets'],
    queryFn: () => getCardSets(),
    enabled: !!user
  });
  
  // Filter collection cards based on search and selected set
  const filteredCollectionCards = collectionCards.filter(card => 
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (viewMode !== "bySet" || !selectedSet || card.setId === selectedSet)
  );
  
  // Group collection cards by set
  const collectionBySet = collectionCards.reduce((acc, card) => {
    if (!acc[card.setId!]) {
      const set = allSets.find(s => s.id === card.setId);
      if (set) {
        acc[card.setId!] = { 
          set,
          cards: []
        };
      }
    }
    
    if (acc[card.setId!]) {
      acc[card.setId!].cards.push(card);
    }
    
    return acc;
  }, {} as Record<string, { set: typeof allSets[0], cards: typeof collectionCards }>);
  
  // Get sets that have cards in the collection
  const setsWithCards = Object.values(collectionBySet)
    .map(({ set }) => set)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  
  // Calculate number of completed sets (100%)
  const completedSets = Object.values(collectionBySet).filter(({ set, cards }) => {
    // A set is complete if the number of collected cards equals the card count in the set
    return cards.length === set.cardCount;
  }).length;
  
  // Calculate total collection value based on Cardmarket trend prices
  const calculateTotalValue = () => {
    let totalValue = 0;
    let countedCards = 0;
    
    collectionCards.forEach(card => {
      if (card.cardmarket?.prices?.trendPrice) {
        totalValue += card.cardmarket.prices.trendPrice;
        countedCards++;
      }
    });
    
    return {
      totalValue: totalValue.toFixed(2),
      countedCards,
      totalCards: collectionCards.length
    };
  };
  
  const collectionValue = calculateTotalValue();
  
  const isLoading = isLoadingIds || isLoadingCards || isLoadingSets;
  
  // Handle export generation
  const handleExport = async (format: 'pdf' | 'image') => {
    if (!user || collectionCards.length === 0) {
      toast({
        title: "Cannot create export",
        description: "Your collection is empty.",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Call the edge function to generate the export
      const { data, error } = await supabase.functions.invoke('generate-collection-export', {
        body: {
          userId: user.id,
          format,
          cards: collectionCards.map(card => ({
            id: card.id,
            name: card.name,
            number: card.number,
            setId: card.setId,
            setName: card.setName,
            image: card.image
          }))
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Export created",
        description: "Your collection export has been created successfully."
      });
      
      // Open download link if available
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error("Error generating export:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating your collection export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!user) {
    return null; // Redirect handled by useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Collection</h1>
          
          <div className="flex space-x-2">
            {/* Export dropdown button - more visible */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Collection</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
                  <FilePdf className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('image')} disabled={isExporting}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Export as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <CollectionExports 
              onExport={handleExport} 
              isExporting={isExporting} 
            />
          </div>
        </div>
        
        {/* Collection stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <h3 className="text-2xl font-bold">{collectionCards.length}</h3>
                </div>
                <Library className="h-8 w-8 text-muted-foreground opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Sets</p>
                  <h3 className="text-2xl font-bold">{completedSets}</h3>
                  <p className="text-xs text-muted-foreground">
                    Out of {setsWithCards.length} sets with cards
                  </p>
                </div>
                <Award className="h-8 w-8 text-muted-foreground opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Collection Value</p>
                  <h3 className="text-2xl font-bold">€{collectionValue.totalValue}</h3>
                  <p className="text-xs text-muted-foreground">
                    {collectionValue.countedCards === collectionValue.totalCards 
                      ? `Based on all ${collectionValue.totalCards} cards` 
                      : `Based on ${collectionValue.countedCards} of ${collectionValue.totalCards} cards with price data`
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search cards"
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
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="bySet">By Set</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="text-sm text-muted-foreground ml-auto">
            {filteredCollectionCards.length} cards collected
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
                <SelectValue placeholder="Select a set" />
              </SelectTrigger>
              <SelectContent>
                {setsWithCards.map(set => (
                  <SelectItem key={set.id} value={set.id}>
                    {set.name} ({collectionBySet[set.id]?.cards.length || 0} cards)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-button animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        ) : filteredCollectionCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">
              {searchQuery 
                ? "No cards match your search" 
                : "You don't have any cards in your collection yet"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
            {!searchQuery && (
              <Button asChild>
                <a href="/sets">Browse sets</a>
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
