
import { useState, useCallback } from 'react';
import { searchCardsByName } from '@/lib/api';
import { CardSuggestion } from '@/components/CardNameTypeahead';
import { searchPokemonNames, formatPokemonName } from '@/lib/cardSearch';
import { Pokemon } from '@/lib/api';

/**
 * Represents a group of cards from the same set
 */
export interface CardGroup {
  set: {
    id: string;
    name: string;
    releaseDate: string;
  };
  cards: Pokemon[];
}

/**
 * Groups an array of cards by set, then sorts:
 *  1) Sets from oldest to newest by releaseDate
 *  2) Cards within each set by numeric part of their number
 */
function groupAndSortCards(cards: Pokemon[]): CardGroup[] {
  // 1) Group cards by set ID
  const map: Record<string, CardGroup> = {};
  
  cards.forEach(card => {
    // Skip cards without proper set info
    if (!card.setId) return;
    
    const key = card.setId;
    
    if (!map[key]) {
      map[key] = {
        set: {
          id: card.setId,
          name: card.setName || 'Unknown Set',
          // Use actual release date from the card data
          releaseDate: card.releaseDate || '1990-01-01', // Default to an old date if not provided
        },
        cards: []
      };
    }
    
    map[key].cards.push(card);
  });

  // 2) Convert to array and sort sets by explicit release date ascending (oldest first)
  const groups = Object.values(map).sort((a, b) => {
    // If we have explicit release dates, use them first (oldest first)
    if (a.set.releaseDate && b.set.releaseDate) {
      const dateA = new Date(a.set.releaseDate.replace(/\//g, '-')).getTime();
      const dateB = new Date(b.set.releaseDate.replace(/\//g, '-')).getTime();
      
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateA - dateB;
      }
    }
    
    // Fall back to set ID comparison if dates are not available or invalid
    return compareSetIds(a.set.id, b.set.id);
  });

  // 3) Sort cards in each set by their number (numeric-aware)
  groups.forEach(group => {
    group.cards.sort((a, b) =>
      a.number.localeCompare(b.number, undefined, { numeric: true })
    );
  });

  return groups;
}

/**
 * Compare two set IDs to determine their chronological order
 * This function preserves the sophisticated series ordering from the original code
 */
function compareSetIds(setIdA: string, setIdB: string): number {
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
    if (setIdA.toLowerCase().startsWith(series) || setIdA.toLowerCase().includes(series)) {
      seriesA = series;
    }
    if (setIdB.toLowerCase().startsWith(series) || setIdB.toLowerCase().includes(series)) {
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
}

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
    if (!pokemonName.trim()) return { cards: [], groupedCards: [] };
    
    try {
      // Format the Pokémon name properly for search
      // Remove any formatting we may have added for display purposes
      const rawName = pokemonName.toLowerCase()
        .replace(/\s+/g, '-') // Convert spaces to hyphens for API compatibility
        .replace(/\./g, '') // Remove periods
        .trim();
      
      console.log(`Searching for cards with Pokémon name: ${rawName}`);
      
      // Use the existing API function to search for cards
      const cards = await searchCardsByName(rawName);
      console.log(`Found ${cards.length} cards for ${rawName}, sorted oldest to newest`);
      
      // Group and sort the cards
      const groupedCards = groupAndSortCards(cards);
      console.log(`Grouped into ${groupedCards.length} sets`);
      
      return { 
        cards, // Original flat list of cards for backward compatibility
        groupedCards // New grouped and sorted structure
      };
    } catch (err) {
      console.error('Card search error:', err);
      return { cards: [], groupedCards: [] };
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
