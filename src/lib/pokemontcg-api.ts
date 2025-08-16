// Pokemon TCG API service (existing API)
import { toast } from "sonner";
import { ApiService, Pokemon, CardSet, CardSuggestion } from '@/types/api';

export class PokemonTcgApiService implements ApiService {
  private readonly API_KEY = "783dd1e4-d581-4f0a-9ed0-9112094116a4";
  private readonly BASE_URL = "https://api.pokemontcg.io/v2";
  private readonly headers = { "X-Api-Key": this.API_KEY };

  getProviderName(): string {
    return "Pokemon TCG API";
  }

  getBaseUrl(): string {
    return this.BASE_URL;
  }

  // For PokemonTCG API, card IDs are already in the format we use
  normalizeCardId(cardId: string): string {
    return cardId;
  }

  denormalizeCardId(cardId: string): string {
    return cardId;
  }

  async getCardSets(): Promise<CardSet[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch(`${this.BASE_URL}/sets`, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      const sets = data.data.map((set: any) => ({
        id: set.id,
        name: set.name,
        logo: set.images.logo,
        symbol: set.images.symbol,
        releaseDate: set.releaseDate,
        cardCount: set.printedTotal || set.total,
        cards: [],
        series: set.series,
        images: {
          symbol: set.images.symbol,
          logo: set.images.logo,
        }
      }));
      
      return sets.sort((a: CardSet, b: CardSet) => 
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    } catch (error) {
      console.error("Error fetching card sets:", error);
      toast.error("Failed to load card sets");
      return [];
    }
  }

  async getCardSetsBySeries(): Promise<Record<string, CardSet[]>> {
    try {
      const sets = await this.getCardSets();
      
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
  }

  async searchCardsByName(query: string): Promise<Pokemon[]> {
    try {
      if (!query.trim()) return [];
      
      const response = await fetch(
        `${this.BASE_URL}/cards?q=name:"${query}"`, 
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        image: card.images.small,
        number: card.number,
        rarity: card.rarity || "Unknown",
        type: card.types ? card.types[0] : "Unknown",
        setId: card.set.id,
        setName: card.set.name,
        releaseDate: card.set.releaseDate,
        tcgplayer: card.tcgplayer,
        prices: card.tcgplayer?.prices,
        cardmarket: card.cardmarket
      }));
    } catch (error) {
      console.error(`Error searching cards:`, error);
      toast.error("Failed to search cards");
      return [];
    }
  }

  async getCardSuggestions(query: string): Promise<CardSuggestion[]> {
    try {
      if (!query || query.length < 2) return [];
      
      const response = await fetch(
        `${this.BASE_URL}/cards?q=name:"${query}*"&orderBy=name&page=1&pageSize=10`, 
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        imageUrl: card.images.small
      }));
    } catch (error) {
      console.error(`Error getting card suggestions:`, error);
      return [];
    }
  }

  async getCardSetById(id: string): Promise<CardSet | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/sets/${id}`, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const setData = await response.json();
      const set = setData.data;
      
      const cardsResponse = await fetch(
        `${this.BASE_URL}/cards?q=set.id:${id}`,
        { headers: this.headers }
      );
      
      if (!cardsResponse.ok) {
        throw new Error(`Cards API request failed with status ${cardsResponse.status}`);
      }
      
      const cardsData = await cardsResponse.json();
      
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
  }

  async getCardById(id: string): Promise<Pokemon | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards/${id}`, { headers: this.headers });
      
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
  }

  async getCardsByIds(cardIds: string[]): Promise<Pokemon[]> {
    try {
      if (!cardIds.length) return [];
      
      const idQuery = `id:${cardIds.join(" OR id:")}`;
      
      const response = await fetch(
        `${this.BASE_URL}/cards?q=${encodeURIComponent(idQuery)}`, 
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
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
      
      return cards;
    } catch (error) {
      console.error("Error fetching cards by IDs:", error);
      toast.error("Failed to load card details");
      return [];
    }
  }
}