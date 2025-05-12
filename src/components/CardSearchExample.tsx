
import React, { useState } from "react";
import CardNameTypeahead from "./CardNameTypeahead";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CardData {
  id: string;
  name: string;
  imageUrl: string;
}

const CardSearchExample: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleCardSelect = (card: CardData) => {
    console.log("Selected card:", card);
    setSelectedCard(card);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Search Pokémon Cards</h2>
      
      <div className="space-y-2">
        <label htmlFor="card-search" className="text-sm font-medium">
          Card Name
        </label>
        <CardNameTypeahead
          onSelect={handleCardSelect}
          placeholder="Type to search cards..."
        />
      </div>
      
      {selectedCard && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Card</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <div className="h-16 w-12">
              <img 
                src={selectedCard.imageUrl} 
                alt={selectedCard.name}
                className="h-full w-full object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <div>
              <div className="font-medium">{selectedCard.name}</div>
              <div className="text-sm text-muted-foreground">ID: {selectedCard.id}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CardSearchExample;
