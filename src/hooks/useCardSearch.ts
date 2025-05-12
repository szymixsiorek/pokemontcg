
import { useState, useCallback } from 'react';
import { getCardSuggestions, searchCardsByName } from '@/lib/api';
import { CardSuggestion } from '@/components/CardNameTypeahead';
import { searchPokemonNames } from '@/lib/cardSearch';

/**
 * Custom hook for card name search functionality
 */
export const useCardSearch = () => {
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch unique Pokémon name suggestions
  const searchPokemon = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use our new function that returns unique Pokémon names
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
      const results = await searchCardsByName(pokemonName);
      return results;
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
    searchCardsByPokemon
  };
};
