import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCardSetById, getUserCollection } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CardSet = () => {
  const { setId } = useParams<{ setId: string }>();
  const { user } = useAuth();
  const { getSeriesColors } = useTheme();
  const { toast } = useToast();
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
  
  // Enhanced CardMarket URL mapping
  const getCardMarketUrl = () => {
    if (!set) return "";
    
    // Special case mapping for known sets
    const specialCaseMap: Record<string, string> = {
      // Scarlet & Violet sets
      "Scarlet & Violet": "Scarlet-Violet",
      "Scarlet & Violet—Paradox Rift": "Paradox-Rift",
      "Scarlet & Violet—Obsidian Flames": "Obsidian-Flames",
      "Scarlet & Violet—Paldea Evolved": "Paldea-Evolved",
      "Scarlet & Violet—151": "151",
      "Scarlet & Violet—Temporal Forces": "Temporal-Forces",
      "Scarlet & Violet—Paldea Fates": "Paldea-Fates",
      "Scarlet & Violet—Twilight Masquerade": "Twilight-Masquerade",
      "Scarlet & Violet—Whimsical Painting": "Whimsical-Painting",
      "Crown Zenith": "Crown-Zenith",
      "Evolving Skies": "Evolving-Skies",
      "Astral Radiance": "Astral-Radiance",
      "Brilliant Stars": "Brilliant-Stars",
      "Fusion Strike": "Fusion-Strike", 
      "Chilling Reign": "Chilling-Reign",
      "Battle Styles": "Battle-Styles",
      "Shining Fates": "Shining-Fates",
      "Journey Together": "Journey-Together", 
      "Pokemon GO": "Pokemon-GO",
      "Lost Origin": "Lost-Origin",
      "Silver Tempest": "Silver-Tempest",
      "Vivid Voltage": "Vivid-Voltage",
      "Darkness Ablaze": "Darkness-Ablaze",
      "Rebel Clash": "Rebel-Clash",
      "Champions Path": "Champions-Path",
      "Cosmic Eclipse": "Cosmic-Eclipse",
      "Hidden Fates": "Hidden-Fates",
      "Unified Minds": "Unified-Minds",
      "Unbroken Bonds": "Unbroken-Bonds",
      "Team Up": "Team-Up",
      "Lost Thunder": "Lost-Thunder",
      "Dragon Majesty": "Dragon-Majesty",
      "Celestial Storm": "Celestial-Storm",
      "Forbidden Light": "Forbidden-Light",
      "Ultra Prism": "Ultra-Prism",
      "Crimson Invasion": "Crimson-Invasion",
      "Shining Legends": "Shining-Legends",
      "Burning Shadows": "Burning-Shadows",
      "Guardians Rising": "Guardians-Rising",
      "Sun & Moon": "Sun-Moon",
    };
    
    // Check if we have a special case mapping for this set
    if (specialCaseMap[set.name]) {
      return `https://www.cardmarket.com/en/Pokemon/Expansions/${specialCaseMap[set.name]}`;
    }
    
    // Default formatting if no special case exists
    const formattedName = set.name
      .replace(/[&]/g, "and")
      .replace(/[^a-zA-Z0-9- ]/g, "")
      .replace(/ /g, "-");
    
    return `https://www.cardmarket.com/en/Pokemon/Expansions/${formattedName}`;
  };
  
  const handleCheckPrices = () => {
    // For now, we'll just show a toast message
    // In the future, this would use the CardMarket API
    toast({
      title: "Coming Soon",
      description: "Price checking functionality will be available soon.",
      duration: 3000,
    });
  };
  
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
      
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-16">
        {/* Breadcrumb navigation */}
        <Breadcrumb className="mb-4 mt-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/sets">Card Sets</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{set?.name || 'Loading...'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <Button variant="outline" asChild>
            <Link to="/sets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sets
            </Link>
          </Button>
          
          {set && (
            <>
              <Button 
                variant="default" 
                className="gap-2"
                asChild
              >
                <a href={getCardMarketUrl()} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4" />
                  Shop This Set
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleCheckPrices}
                className="gap-2"
              >
                Check Set Prices
              </Button>
            </>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="pokeball-loader mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        ) : set ? (
          <>
            <div className="mb-8 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold">
                  {set.name}
                </h1>
                <p className="text-muted-foreground">
                  {set.cardCount} cards in set • Release Date: {set.releaseDate}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Series: <span className="dark:text-white text-black">{set.series}</span>
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
                    Logo not available
                  </div>
                )}
              </div>
            </div>
            
            {user && (
              <div className="mb-6 bg-card p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Collection Progress
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
            <p className="text-destructive mb-4">Set not found</p>
            <Button asChild>
              <Link to="/sets">
                Back to Sets
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
