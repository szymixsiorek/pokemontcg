// API Provider Types and Interfaces

export type ApiProvider = 'pokemontcg' | 'tcgdx';

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  number: string;
  rarity: string;
  type: string;
  setId?: string;
  setName?: string;
  releaseDate?: string;
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

export interface CardSuggestion {
  id: string;
  name: string;
  imageUrl?: string;
  displayName?: string;
}

// API Service Interface - all API providers must implement this
export interface ApiService {
  getCardSets(): Promise<CardSet[]>;
  getCardSetsBySeries(): Promise<Record<string, CardSet[]>>;
  searchCardsByName(query: string): Promise<Pokemon[]>;
  getCardSuggestions(query: string): Promise<CardSuggestion[]>;
  getCardSetById(id: string): Promise<CardSet | undefined>;
  getCardById(id: string): Promise<Pokemon | undefined>;
  getCardsByIds(cardIds: string[]): Promise<Pokemon[]>;
  
  // Metadata about the API
  getProviderName(): string;
  getBaseUrl(): string;
  
  // Card ID mapping functions
  normalizeCardId(cardId: string): string;
  denormalizeCardId(cardId: string): string;
}

// Card ID mapping entry for translating between APIs
export interface CardIdMapping {
  pokemontcg_id: string;
  tcgdx_id: string;
  set_id: string;
  card_number: string;
  created_at?: string;
}