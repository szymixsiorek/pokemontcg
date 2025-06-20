
// Pokemon TCG API service
// Documentation: https://docs.pokemontcg.io/

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// API key for Pokemon TCG API
const API_KEY = "783dd1e4-d581-4f0a-9ed0-9112094116a4";

// Base URL for the API
const BASE_URL = "https://api.pokemontcg.io/v2";

// Headers for API requests
const headers = {
  "X-Api-Key": API_KEY,
};

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  number: string;
  rarity: string;
  type: string;
  setId?: string;
  setName?: string;
  releaseDate?: string; // Added releaseDate property to fix TypeScript error
  prices?: {
    normal?: { low: number; mid: number; high: number; market: number; directLow: number };
    holofoil?: { low: number; mid: number; high: number; market: number; directLow: number };
    reverseHolofoil?: { low: number; mid: number; high: number; market: number; directLow: number };
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      normal?: { low: number; mid: number; high: number; market: number; directLow: number };
      holofoil?: { low: number; mid: number; high: number; market: number; directLow: number };
      reverseHolofoil?: { low: number; mid: number; high: number; market: number; directLow: number };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
      germanProLow: number;
      suggestedPrice: number;
      reverseHoloSell: number;
      reverseHoloLow: number;
      reverseHoloTrend: number;
      lowPriceExPlus: number;
      avg1: number;
      avg7: number;
      avg30: number;
      reverseHoloAvg1: number;
      reverseHoloAvg7: number;
      reverseHoloAvg30: number;
    };
  };
}

export interface CardSet {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  releaseDate: string;
  cardCount: number;
  cards: Pokemon[];
  series: string;
  images: {
    symbol: string;
    logo: string;
  };
}

// Fetch all sets from the API
export const getCardSets = async (): Promise<CardSet[]> => {
  try {
    // Simulate API delay for development
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await fetch(`${BASE_URL}/sets`, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API data to match our CardSet interface and sort by release date (newest first)
    const sets = data.data.map((set: any) => ({
      id: set.id,
      name: set.name,
      logo: set.images.logo,
      symbol: set.images.symbol,
      releaseDate: set.releaseDate,
      cardCount: set.printedTotal || set.total,
      cards: [], // Cards will be loaded separately when needed
      series: set.series,
      images: {
        symbol: set.images.symbol,
        logo: set.images.logo,
      }
    }));
    
    // Sort by release date (newest first)
    return sets.sort((a: CardSet, b: CardSet) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  } catch (error) {
    console.error("Error fetching card sets:", error);
    toast.error("Failed to load card sets");
    return [];
  }
};

// Get sets grouped by series
export const getCardSetsBySeries = async (): Promise<Record<string, CardSet[]>> => {
  try {
    const sets = await getCardSets();
    
    // Group by series and maintain sort order within each series
    return sets.reduce((acc, set) => {
      if (!acc[set.series]) {
        acc[set.series] = [];
      }
      acc[set.series].push(set);
      return acc;
    }, {} as Record<string, CardSet[]>);
  } catch (error) {
    console.error("Error fetching sets by series:", error);
    toast.error("Failed to load card sets");
    return {};
  }
};

// Search cards by name
export const searchCardsByName = async (query: string): Promise<Pokemon[]> => {
  try {
    if (!query.trim()) return [];
    
    const response = await fetch(
      `${BASE_URL}/cards?q=name:"${query}"`, 
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API data to match our Pokemon interface
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      image: card.images.small,
      number: card.number,
      rarity: card.rarity || "Unknown",
      type: card.types ? card.types[0] : "Unknown",
      setId: card.set.id,
      setName: card.set.name,
      releaseDate: card.set.releaseDate, // Extract the releaseDate from the card data
      tcgplayer: card.tcgplayer,
      prices: card.tcgplayer?.prices,
      cardmarket: card.cardmarket
    }));
  } catch (error) {
    console.error(`Error searching cards:`, error);
    toast.error("Failed to search cards");
    return [];
  }
};

// API endpoint for typeahead suggestions - this emulates a server-side API endpoint
export const getCardSuggestions = async (query: string): Promise<any[]> => {
  try {
    if (!query || query.length < 2) return [];
    
    const response = await fetch(
      `${BASE_URL}/cards?q=name:"${query}*"&orderBy=name&page=1&pageSize=10`, 
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract just what we need for autocomplete suggestions
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images.small
    }));
  } catch (error) {
    console.error(`Error getting card suggestions:`, error);
    return [];
  }
};

// Get a specific card set by ID
export const getCardSetById = async (id: string): Promise<CardSet | undefined> => {
  try {
    // First fetch the set information
    const response = await fetch(`${BASE_URL}/sets/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const setData = await response.json();
    const set = setData.data;
    
    // Then fetch all cards in this set
    const cardsResponse = await fetch(
      `${BASE_URL}/cards?q=set.id:${id}`,
      { headers }
    );
    
    if (!cardsResponse.ok) {
      throw new Error(`Cards API request failed with status ${cardsResponse.status}`);
    }
    
    const cardsData = await cardsResponse.json();
    
    // Transform card data to match our Pokemon interface
    const cards = cardsData.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      image: card.images.small,
      number: card.number,
      rarity: card.rarity || "Unknown",
      type: card.types ? card.types[0] : "Unknown",
      tcgplayer: card.tcgplayer,
      prices: card.tcgplayer?.prices,
      cardmarket: card.cardmarket
    }));
    
    // Return the complete set with cards
    return {
      id: set.id,
      name: set.name,
      logo: set.images.logo,
      symbol: set.images.symbol,
      releaseDate: set.releaseDate,
      cardCount: set.printedTotal || set.total,
      cards: cards,
      series: set.series,
      images: {
        symbol: set.images.symbol,
        logo: set.images.logo,
      }
    };
  } catch (error) {
    console.error(`Error fetching set ${id}:`, error);
    toast.error("Failed to load card set");
    return undefined;
  }
};

// Get detailed card information
export const getCardById = async (id: string): Promise<Pokemon | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const card = data.data;
    
    return {
      id: card.id,
      name: card.name,
      image: card.images.small,
      number: card.number,
      rarity: card.rarity || "Unknown",
      type: card.types ? card.types[0] : "Unknown",
      setId: card.set.id,
      setName: card.set.name,
      tcgplayer: card.tcgplayer,
      prices: card.tcgplayer?.prices,
      cardmarket: card.cardmarket
    };
  } catch (error) {
    console.error(`Error fetching card ${id}:`, error);
    toast.error("Failed to load card details");
    return undefined;
  }
};

// Get user's collection from Supabase
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
      toast.error("Failed to load your collection");
      return [];
    }
    
    const cardIds = data.map(item => item.card_id);
    console.log("Collection fetched, card IDs:", cardIds);
    return cardIds;
  } catch (error) {
    console.error("Error fetching collection:", error);
    toast.error("Failed to load your collection");
    return [];
  }
};

// Get cards by IDs
export const getCardsByIds = async (cardIds: string[]): Promise<Pokemon[]> => {
  try {
    if (!cardIds.length) return [];
    
    console.log("Fetching cards with IDs:", cardIds);
    
    // The Pokemon TCG API supports fetching multiple cards by ID in a single request
    // We'll use the q parameter to filter by id
    const idQuery = `id:${cardIds.join(" OR id:")}`;
    
    const response = await fetch(
      `${BASE_URL}/cards?q=${encodeURIComponent(idQuery)}`, 
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API data to match our Pokemon interface
    const cards = data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      image: card.images.small,
      number: card.number,
      rarity: card.rarity || "Unknown",
      type: card.types ? card.types[0] : "Unknown",
      setId: card.set.id,
      setName: card.set.name,
      tcgplayer: card.tcgplayer,
      prices: card.tcgplayer?.prices,
      cardmarket: card.cardmarket
    }));
    
    console.log(`Successfully fetched ${cards.length} cards`);
    return cards;
  } catch (error) {
    console.error("Error fetching cards by IDs:", error);
    toast.error("Failed to load card details");
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

// Deprecated - for backward compatibility during transition
const userCollection: Record<string, string[]> = {};
export const initializeCollections = (): void => {
  // This function is kept for backward compatibility but no longer needed
  console.log("Collection storage moved to Supabase");
};

// Initialize collections when the module loads
initializeCollections();
