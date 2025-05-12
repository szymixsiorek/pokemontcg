import { useState, useCallback } from 'react';
import { searchCardsByName } from '@/lib/api';
import { CardSuggestion } from '@/components/CardNameTypeahead';
import { searchPokemonNames, formatPokemonName } from '@/lib/cardSearch';

/**
 * Custom hook for card name search functionality
 */
export const useCardSearch = () => {
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch Pokémon name suggestions with artwork
  const searchPokemon = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use our new function that returns Pokémon names with artwork
      const results = await searchPokemonNames(query);
      setSuggestions(results);
    } catch (err) {
      setError('Failed to fetch suggestions');
      console.error('Pokémon name search error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to search for all cards of a specific Pokémon
  const searchCardsByPokemon = useCallback(async (pokemonName: string) => {
    if (!pokemonName.trim()) return [];
    
    try {
      // Format the Pokémon name properly for search
      // Remove any formatting we may have added for display purposes
      const rawName = pokemonName.toLowerCase()
        .replace(/\s+/g, '-') // Convert spaces to hyphens for API compatibility
        .replace(/\./g, '') // Remove periods
        .trim();
      
      console.log(`Searching for cards with Pokémon name: ${rawName}`);
      
      // Use the existing API function to search for cards
      const results = await searchCardsByName(rawName);
      
      // Sort results by set release date (oldest first)
      // We use the card ID pattern which typically follows set-number format
      const sortedResults = [...results].sort((a, b) => {
        // Extract set IDs from card IDs (format is usually setid-number)
        const setIdA = a.id.split('-')[0];
        const setIdB = b.id.split('-')[0];
        return setIdA.localeCompare(setIdB); // Oldest sets first
      });
      
      console.log(`Found ${sortedResults.length} cards for ${rawName}, sorted oldest to newest`);
      return sortedResults;
    } catch (err) {
      console.error('Card search error:', err);
      return [];
    }
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchPokemon,
    searchCardsByPokemon,
    formatPokemonName // Export the format function
  };
};
