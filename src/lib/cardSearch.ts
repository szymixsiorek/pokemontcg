import { searchCardsByName } from "./api";

// Define the shape of the card suggestion returned from the search
export interface CardSuggestion {
  id: string;
  name: string;
  imageUrl?: string;
}

// Get unique Pokémon names for typeahead suggestions
export const searchPokemonNames = async (query: string): Promise<CardSuggestion[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Use the existing searchCardsByName function from api.ts
    const results = await searchCardsByName(query);
    
    // Create a Map to track unique Pokémon names
    const uniqueNames = new Map<string, CardSuggestion>();
    
    results.forEach(card => {
      // Only add each Pokémon name once
      if (!uniqueNames.has(card.name)) {
        uniqueNames.set(card.name, {
          id: card.id, // Use the first card's ID
          name: card.name,
          imageUrl: card.image
        });
      }
    });
    
    // Convert Map values to array and limit to 10 suggestions
    return Array.from(uniqueNames.values()).slice(0, 10);
  } catch (error) {
    console.error("Error searching Pokémon names:", error);
    return [];
  }
};

// Keep the original function for searching all cards of a specific Pokémon
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
