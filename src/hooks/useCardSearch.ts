
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
      
      // Enhanced sorting logic with more reliable set ordering
      const sortedResults = [...results].sort((a, b) => {
        // Extract set IDs from card IDs (format is usually setid-number)
        const setIdA = a.id.split('-')[0];
        const setIdB = b.id.split('-')[0];
        
        // More comprehensive series ordering
        // This defines the exact order of all known Pokémon TCG series from oldest to newest
        const seriesOrder = [
          // Base sets and early expansions
          'base', 'jungle', 'fossil', 'base2', 'team', 'gym', 
          
          // Neo series
          'neo', 
          
          // e-Card series
          'legendary', 'expedition', 'aquapolis', 'skyridge', 
          
          // EX series
          'ex', 'ruby', 'sapphire', 'sandstorm', 'dragon', 'magma', 'hidden', 'firered', 
          'leafgreen', 'team', 'deoxys', 'emerald', 'unseen', 'holon', 'crystal', 'delta',
          'legend', 'maker', 'pop', 
          
          // Diamond & Pearl series
          'np', 'dp', 'mysterious', 'secret', 'great', 'majestic', 'pop', 'platinum',
          'rising', 'supreme', 'arceus', 
          
          // HeartGold SoulSilver series
          'pl', 'hgss', 'hs', 'unleashed', 'undaunted', 'triumphant', 
          
          // Call of Legends
          'col', 
          
          // Black & White series
          'bw', 'emerging', 'noble', 'next', 'dark', 'dragon', 'boundaries', 'plasma',
          'freeze', 'blast', 'legendary',
          
          // XY series
          'xy', 'flashfire', 'furious', 'phantom', 'primal', 'roaring', 'ancient', 'breakthrough',
          'breakpoint', 'generations', 'fates', 'steam', 'evolutions', 
          
          // Sun & Moon series
          'sm', 'guardians', 'burning', 'shining', 'crimson', 'ultra', 'forbidden', 'celestial',
          'dragon', 'unified', 'unbroken', 'cosmic', 'hidden', 'detective', 'shiny',
          
          // Sword & Shield series
          'swsh', 'rebel', 'darkness', 'champion', 'vivid', 'battle', 'shining', 'chilling',
          'evolving', 'fusion', 'brilliant', 'astral', 'lost', 'silver', 'crown',
          
          // Scarlet & Violet series 
          'sv', 'paldea', 'obsidian', 'paradox', 'temporal', 'pitt', 'mask', 'twilight'
        ];
        
        // Match each set ID to its series
        let seriesA = '';
        let seriesB = '';
        
        for (const series of seriesOrder) {
          if (setIdA.startsWith(series) || setIdA.includes(series)) {
            seriesA = series;
          }
          if (setIdB.startsWith(series) || setIdB.includes(series)) {
            seriesB = series;
          }
        }
        
        // If we found matching series for both cards
        if (seriesA && seriesB) {
          const seriesAIndex = seriesOrder.indexOf(seriesA);
          const seriesBIndex = seriesOrder.indexOf(seriesB);
          
          // If they're from different series, sort by series first
          if (seriesAIndex !== seriesBIndex) {
            return seriesAIndex - seriesBIndex;
          }
        }
        
        // If same series or series not found, try to use numbers in the set ID
        // Extract numbers from the set IDs 
        const numA = parseInt(setIdA.replace(/[^0-9]/g, '') || '0');
        const numB = parseInt(setIdB.replace(/[^0-9]/g, '') || '0');
        
        // If both have numbers and they're in the same series, compare numbers
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        
        // Last resort: alphabetical comparison of the set IDs
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
