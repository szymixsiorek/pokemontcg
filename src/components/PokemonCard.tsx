
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
import type { Pokemon } from "@/lib/api";
import { addCardToCollection, removeCardFromCollection } from "@/lib/api";

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
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4 space-y-3">
        <div className="relative group">
          <img 
            src={card.image} 
            alt={card.name}
            className="rounded-md w-full object-contain"
          />
          
          {user && (
            <Button
              size="icon"
              variant={isInCollection ? "destructive" : "default"}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
        </div>
        
        <div className="text-center">
          <h3 className="font-medium truncate">{card.name}</h3>
          <div className="flex items-center justify-center text-xs text-muted-foreground space-x-2">
            <span>{card.number}</span>
            <span>•</span>
            <span>{card.rarity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
