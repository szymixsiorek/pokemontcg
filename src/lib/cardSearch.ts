import { searchCardsByName } from "./api";

// Define the shape of the card suggestion returned from the search
export interface CardSuggestion {
  id: string;
  name: string;
  imageUrl?: string;
  displayName?: string; // Added this property to be consistent with the interface in CardNameTypeahead.tsx
}

// Pokemon API data structure
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

// Format Pokémon name for display (capitalize and replace hyphens with spaces)
export const formatPokemonName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Get Pokemon names and images from PokeAPI for typeahead suggestions
export const searchPokemonNames = async (query: string): Promise<CardSuggestion[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // First get a list of Pokemon that match the query
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    
    if (!response.ok) {
      throw new Error(`Pokemon API request failed with status ${response.status}`);
    }
    
    const data: PokemonListResponse = await response.json();
    
    // Filter Pokemon names that match the query (case-insensitive)
    const filteredResults = data.results
      .filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10); // Limit to 10 suggestions
    
    // Get details for each matching Pokemon to retrieve the official artwork
    const pokemonDetailsPromises = filteredResults.map(pokemon => 
      fetch(pokemon.url).then(res => res.json())
    );
    
    const pokemonDetails: PokemonDetails[] = await Promise.all(pokemonDetailsPromises);
    
    // Transform the results to match our CardSuggestion interface
    return pokemonDetails.map(pokemon => ({
      id: pokemon.id.toString(),
      name: pokemon.name,
      displayName: formatPokemonName(pokemon.name),
      imageUrl: pokemon.sprites.other["official-artwork"].front_default
    }));
  } catch (error) {
    console.error("Error searching Pokémon names:", error);
    return [];
  }
};

// Search all cards of a specific Pokémon, sorted by set release date (oldest first)
export const searchCards = async (query: string): Promise<CardSuggestion[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Use the existing searchCardsByName function from api.ts
    const results = await searchCardsByName(query);
    
    // Map the results to match our CardSuggestion interface
    return results.map(card => ({
      id: card.id,
      name: card.name,
      displayName: formatPokemonName(card.name),
      imageUrl: card.image
    }));
  } catch (error) {
    console.error("Error searching cards:", error);
    return [];
  }
};
