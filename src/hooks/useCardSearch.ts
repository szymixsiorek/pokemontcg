
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
      
      // Improved sorting logic to handle set order correctly
      const sortedResults = [...results].sort((a, b) => {
        // Extract set IDs from card IDs (format is usually setid-number)
        const setIdA = a.id.split('-')[0];
        const setIdB = b.id.split('-')[0];
        
        // For more reliable sorting, we'll add some special handling for known set ID patterns
        
        // First, try to extract series number if available (like "swsh" vs "sv")
        const seriesA = setIdA.replace(/[0-9]/g, '');
        const seriesB = setIdB.replace(/[0-9]/g, '');
        
        // If they're from different series, sort by series first
        if (seriesA !== seriesB) {
          // Known series order from oldest to newest
          const seriesOrder = [
            'base', 'jungle', 'fossil', 'base2', 'team', 'gym', 'neo',
            'legendary', 'expedition', 'aquapolis', 'skyridge', 'ex', 'np', 'dp',
            'pl', 'hgss', 'col', 'bw', 'xy', 'sm', 'swsh', 'sv'
          ];
          
          const seriesAIndex = seriesOrder.findIndex(s => seriesA.includes(s));
          const seriesBIndex = seriesOrder.findIndex(s => seriesB.includes(s));
          
          // If both series are recognized, sort by their known order
          if (seriesAIndex !== -1 && seriesBIndex !== -1) {
            return seriesAIndex - seriesBIndex;
          }
        }
        
        // Second pass - check if the IDs have numbers that can be compared
        const numA = parseInt(setIdA.replace(/[^0-9]/g, '') || '0');
        const numB = parseInt(setIdB.replace(/[^0-9]/g, '') || '0');
        
        // If they're in the same series, compare their numbers
        if (seriesA === seriesB && !isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        
        // Fallback to basic string comparison if other methods don't work
        return setIdA.localeCompare(setIdB);
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
