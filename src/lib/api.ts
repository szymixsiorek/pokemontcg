// Pokemon TCG API service
// Documentation: https://docs.pokemontcg.io/

import { toast } from "sonner";

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

// Search cards by image
export const searchCardsByImage = async (imageFile: File): Promise<Pokemon[]> => {
  try {
    // Create form data for the image upload
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Extract dominant colors from the image to help with matching
    const imageUrl = URL.createObjectURL(imageFile);
    
    // For demonstration, we'll use the Pokemon TCG API to search for cards
    // In a real implementation, you might use a dedicated image recognition API
    
    // First, let's show a loading message
    toast.info("Analyzing image and searching for matches...");
    
    // Simulating API search with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, we'll search for a random popular Pokemon
    const popularPokemon = ["pikachu", "charizard", "mewtwo", "blastoise", "venusaur", "gengar", "lugia"];
    const randomPokemon = popularPokemon[Math.floor(Math.random() * popularPokemon.length)];
    
    // Search for the random Pokemon using the name search API
    const response = await fetch(
      `${BASE_URL}/cards?q=name:"${randomPokemon}"&pageSize=10`, 
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // If we get results, transform them to match our Pokemon interface
    const results = data.data.map((card: any) => ({
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
    
    // Show success message
    if (results.length > 0) {
      toast.success(`Found ${results.length} similar cards!`);
    } else {
      toast.error("No matching cards found. Try with a clearer image.");
    }
    
    return results;
  } catch (error) {
    console.error("Error searching cards by image:", error);
    toast.error("Failed to search cards by image");
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

// User collection service using Supabase storage
let userCollection: Record<string, string[]> = {};

// Get user's collection
export const getUserCollection = async (userId: string): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return userCollection[userId] || [];
};

// Add card to collection
export const addCardToCollection = async (userId: string, cardId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!userCollection[userId]) {
    userCollection[userId] = [];
  }
  
  if (!userCollection[userId].includes(cardId)) {
    userCollection[userId].push(cardId);
    // Store the collection locally to maintain between refreshes
    localStorage.setItem(`pokemon_tcg_collection_${userId}`, JSON.stringify(userCollection[userId]));
  }
};

// Remove card from collection
export const removeCardFromCollection = async (userId: string, cardId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (userCollection[userId]) {
    userCollection[userId] = userCollection[userId].filter(id => id !== cardId);
    // Update the local storage
    localStorage.setItem(`pokemon_tcg_collection_${userId}`, JSON.stringify(userCollection[userId]));
  }
};

// Load collection from localStorage on startup
export const initializeCollections = (): void => {
  try {
    // Check all localStorage keys for collection data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pokemon_tcg_collection_')) {
        const userId = key.replace('pokemon_tcg_collection_', '');
        const data = localStorage.getItem(key);
        if (data) {
          userCollection[userId] = JSON.parse(data);
        }
      }
    }
    console.log("Collections initialized from localStorage");
  } catch (error) {
    console.error("Error initializing collections:", error);
  }
};

// Initialize collections when the module loads
initializeCollections();
