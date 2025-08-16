// Updated API service with abstraction layer
import { supabase } from "@/integrations/supabase/client";

// Re-export types for backward compatibility
export type { Pokemon, CardSet, CardSuggestion } from '@/types/api';

// Import types for use in this file
import type { Pokemon, CardSet } from '@/types/api';

// Wrapper functions that use the current API provider
export const getCardSets = async (): Promise<CardSet[]> => {
  // This will be called from components that have access to useApi
  throw new Error("Use useApi().apiService.getCardSets() instead");
};

export const getCardSetsBySeries = async (): Promise<Record<string, CardSet[]>> => {
  throw new Error("Use useApi().apiService.getCardSetsBySeries() instead");
};

export const searchCardsByName = async (query: string): Promise<Pokemon[]> => {
  throw new Error("Use useApi().apiService.searchCardsByName() instead");
};

export const getCardSuggestions = async (query: string): Promise<any[]> => {
  throw new Error("Use useApi().apiService.getCardSuggestions() instead");
};

export const getCardSetById = async (id: string): Promise<CardSet | undefined> => {
  throw new Error("Use useApi().apiService.getCardSetById() instead");
};

export const getCardById = async (id: string): Promise<Pokemon | undefined> => {
  throw new Error("Use useApi().apiService.getCardById() instead");
};

export const getCardsByIds = async (cardIds: string[]): Promise<Pokemon[]> => {
  throw new Error("Use useApi().apiService.getCardsByIds() instead");
};

// Collection management functions that work with any API provider
export const getUserCollection = async (userId: string): Promise<string[]> => {
  try {
    if (!userId) return [];
    
    console.log("Fetching collection for user ID:", userId);
    
    const { data, error } = await supabase
      .from('user_collections')
      .select('card_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching collection:", error);
      return [];
    }
    
    const cardIds = data.map(item => item.card_id);
    console.log("Collection fetched, card IDs:", cardIds);
    return cardIds;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return [];
  }
};

// Add card to collection in Supabase
export const addCardToCollection = async (userId: string, cardId: string): Promise<void> => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    // Get the set ID from the card ID (format: <set-id>-<card-number>)
    const setId = cardId.split('-')[0];
    
    const { error } = await supabase
      .from('user_collections')
      .insert({
        user_id: userId,
        card_id: cardId,
        set_id: setId
      });
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log("Card already in collection");
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error adding card to collection:", error);
    throw error;
  }
};

// Remove card from collection in Supabase
export const removeCardFromCollection = async (userId: string, cardId: string): Promise<void> => {
  try {
    if (!userId) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('user_collections')
      .delete()
      .eq('user_id', userId)
      .eq('card_id', cardId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error removing card from collection:", error);
    throw error;
  }
};

// Card ID mapping functions - placeholder implementation
export const getCardIdMapping = async (fromProvider: string, fromId: string, toProvider: string): Promise<string | null> => {
  // Placeholder - for now just return the same ID
  // This will be enhanced once the API mapping is properly set up
  return fromId;
};

export const createCardIdMapping = async (pokemontcgId: string, tcgdxId: string, setId: string, cardNumber: string, cardName: string): Promise<void> => {
  // Placeholder implementation
  console.log('Card ID mapping creation not yet implemented');
};

// Legacy function for backward compatibility
export const initializeCollections = (): void => {
  console.log("Collection storage moved to Supabase");
};

initializeCollections();