
import { searchCardsByName } from "./api";

// Define the shape of the card suggestion returned from the search
export interface CardSuggestion {
  id: string;
  name: string;
  imageUrl?: string;
}

// Mock API handler for card search
export const searchCards = async (query: string): Promise<CardSuggestion[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Use the existing searchCardsByName function from api.ts
    const results = await searchCardsByName(query);
    
    // Map the results to match our CardSuggestion interface
    return results.map(card => ({
      id: card.id,
      name: card.name,
      imageUrl: card.image
    }));
  } catch (error) {
    console.error("Error searching cards:", error);
    return [];
  }
};
