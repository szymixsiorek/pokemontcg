
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus, DollarSign, ExternalLink, Maximize } from "lucide-react";
import type { Pokemon } from "@/lib/api";
import { addCardToCollection, removeCardFromCollection } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PokemonCardProps {
  card: Pokemon;
  inCollection?: boolean;
  onCollectionUpdate?: () => void;
}

const PokemonCard = ({ card, inCollection = false, onCollectionUpdate }: PokemonCardProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isInCollection, setIsInCollection] = useState(inCollection);
  const [isFullSizeImage, setIsFullSizeImage] = useState(false);
  
  const handleToggleCollection = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your collection",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isInCollection) {
        await removeCardFromCollection(user.id, card.id);
        setIsInCollection(false);
        toast({
          description: "Card removed from your collection",
        });
      } else {
        await addCardToCollection(user.id, card.id);
        setIsInCollection(true);
        toast({
          description: "Card added to your collection",
        });
      }
      if (onCollectionUpdate) {
        onCollectionUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "N/A";
    return `$${price.toFixed(2)}`;
  };
  
  const formatEuroPrice = (price?: number) => {
    if (price === undefined || price === null) return "N/A";
    return `€${price.toFixed(2)}`;
  };
  
  const getTCGPlayerPriceData = () => {
    if (!card.tcgplayer?.prices) return null;
    
    const priceTypes = ["normal", "holofoil", "reverseHolofoil"];
    for (const type of priceTypes) {
      const priceData = card.tcgplayer.prices[type as keyof typeof card.tcgplayer.prices];
      if (priceData) {
        return {
          type,
          ...priceData
        };
      }
    }
    return null;
  };

  const getHighResImage = (imageUrl: string): string => {
    return imageUrl.replace(/\.png$/, '_hires.png');
  };

  const tcgPlayerPriceData = getTCGPlayerPriceData();
  const cardmarketData = card.cardmarket;
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4 space-y-3">
        <div className="relative group">
          <img 
            src={card.image} 
            alt={card.name}
            className="rounded-md w-full object-contain"
          />
          
          <div className="absolute bottom-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {user && (
              <Button
                size="icon"
                variant={isInCollection ? "destructive" : "default"}
                onClick={handleToggleCollection}
                disabled={isLoading}
              >
                {isInCollection ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {(card.tcgplayer || card.cardmarket) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md w-full">
                  <DialogHeader>
                    <DialogTitle>{card.name}</DialogTitle>
                    <DialogDescription>
                      {card.number} • {card.rarity} {card.setName && (
                        <>
                          • <Link to={`/sets/${card.setId}`} className="text-primary hover:underline">
                              {card.setName}
                            </Link>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-full flex justify-center items-center relative group">
                        <img 
                          src={getHighResImage(card.image)} 
                          alt={card.name} 
                          className="w-[80%] object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = card.image;
                          }}
                        />
                        <button
                          onClick={() => setIsFullSizeImage(true)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1"
                        >
                          <Maximize className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <Dialog open={isFullSizeImage} onOpenChange={setIsFullSizeImage}>
                        <DialogContent className="max-w-3xl">
                          <img 
                            src={getHighResImage(card.image)} 
                            alt={card.name} 
                            className="w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = card.image;
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <Tabs defaultValue="tcgplayer" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tcgplayer">TCGPlayer</TabsTrigger>
                        <TabsTrigger value="cardmarket">Cardmarket</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="tcgplayer" className="w-full">
                        {tcgPlayerPriceData ? (
                          <div className="space-y-1 w-full">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("market_price")}:</span>
                              <span className="font-semibold">{formatPrice(tcgPlayerPriceData.market)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("low_price")}:</span>
                              <span>{formatPrice(tcgPlayerPriceData.low)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("mid_price")}:</span>
                              <span>{formatPrice(tcgPlayerPriceData.mid)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("high_price")}:</span>
                              <span>{formatPrice(tcgPlayerPriceData.high)}</span>
                            </div>
                            
                            {card.tcgplayer?.url && (
                              <Button 
                                className="mt-4 w-full" 
                                variant="outline" 
                                onClick={() => window.open(card.tcgplayer.url, "_blank")}
                              >
                                {t("buy_on_tcgplayer")}
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm p-4">{t("no_price_data")}</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="cardmarket" className="w-full">
                        {cardmarketData?.prices ? (
                          <div className="space-y-1 w-full">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("trend_price")}:</span>
                              <span className="font-semibold">{formatEuroPrice(cardmarketData.prices.trendPrice)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("avg_sell_price")}:</span>
                              <span>{formatEuroPrice(cardmarketData.prices.averageSellPrice)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("low_price")}:</span>
                              <span>{formatEuroPrice(cardmarketData.prices.lowPrice)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("one_day_avg")}:</span>
                              <span>{formatEuroPrice(cardmarketData.prices.avg1)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("seven_day_avg")}:</span>
                              <span>{formatEuroPrice(cardmarketData.prices.avg7)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">{t("thirty_day_avg")}:</span>
                              <span>{formatEuroPrice(cardmarketData.prices.avg30)}</span>
                            </div>
                            
                            {cardmarketData.url && (
                              <Button 
                                className="mt-4 w-full" 
                                variant="outline" 
                                onClick={() => window.open(cardmarketData.url, "_blank")}
                              >
                                {t("buy_on_cardmarket")}
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm p-4">{t("no_price_data")}</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-medium truncate">{card.name}</h3>
          <div className="flex items-center justify-center text-xs text-muted-foreground space-x-2">
            <span>{card.number}</span>
            <span>•</span>
            <span>{card.rarity}</span>
          </div>
          {card.setId && card.setName && (
            <div className="text-xs mt-1">
              <Link to={`/sets/${card.setId}`} className="text-primary hover:underline">
                {card.setName}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
