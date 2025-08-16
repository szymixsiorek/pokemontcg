// TCGdx API service (new API)
import { toast } from "sonner";
import { ApiService, Pokemon, CardSet, CardSuggestion } from '@/types/api';

export class TcgdxApiService implements ApiService {
  private readonly BASE_URL = "https://api.tcgdx.net/v2/en";

  getProviderName(): string {
    return "TCGdx API";
  }

  getBaseUrl(): string {
    return this.BASE_URL;
  }

  // TCGdx uses different ID format, we'll need to map these
  normalizeCardId(cardId: string): string {
    // For now, return as-is, but this would need proper mapping
    return cardId;
  }

  denormalizeCardId(cardId: string): string {
    // For now, return as-is, but this would need proper mapping
    return cardId;
  }

  private transformTcgdxCard(card: any): Pokemon {
    return {
      id: card.id,
      name: card.name,
      image: card.image,
      number: card.localId?.toString() || card.id,
      rarity: card.rarity?.name || "Unknown",
      type: card.types?.[0]?.name || "Unknown",
      setId: card.set?.id,
      setName: card.set?.name,
      releaseDate: card.set?.releaseDate,
      // TCGdx doesn't have pricing data like Pokemon TCG API
      prices: undefined,
      tcgplayer: undefined,
      cardmarket: undefined
    };
  }

  private transformTcgdxSet(set: any): CardSet {
    return {
      id: set.id,
      name: set.name,
      logo: set.logo || '',
      symbol: set.symbol || '',
      releaseDate: set.releaseDate || '',
      cardCount: set.cardCount?.total || 0,
      cards: [],
      series: set.serie?.name || 'Unknown',
      images: {
        symbol: set.symbol || '',
        logo: set.logo || '',
      }
    };
  }

  async getCardSets(): Promise<CardSet[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/sets`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      const sets = data.map((set: any) => this.transformTcgdxSet(set));
      
      // Sort by release date (newest first)
      return sets.sort((a: CardSet, b: CardSet) => 
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    } catch (error) {
      console.error("Error fetching card sets from TCGdx:", error);
      toast.error("Failed to load card sets from TCGdx");
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
      console.error("Error fetching sets by series from TCGdx:", error);
      toast.error("Failed to load card sets from TCGdx");
      return {};
    }
  }

  async searchCardsByName(query: string): Promise<Pokemon[]> {
    try {
      if (!query.trim()) return [];
      
      // TCGdx search endpoint - this might need adjustment based on actual API
      const response = await fetch(`${this.BASE_URL}/cards?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both array and paginated responses
      const cards = Array.isArray(data) ? data : (data.data || []);
      
      return cards.map((card: any) => this.transformTcgdxCard(card));
    } catch (error) {
      console.error(`Error searching cards in TCGdx:`, error);
      toast.error("Failed to search cards in TCGdx");
      return [];
    }
  }

  async getCardSuggestions(query: string): Promise<CardSuggestion[]> {
    try {
      if (!query || query.length < 2) return [];
      
      const response = await fetch(`${this.BASE_URL}/cards?q=${encodeURIComponent(query)}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const cards = Array.isArray(data) ? data : (data.data || []);
      
      return cards.slice(0, 10).map((card: any) => ({
        id: card.id,
        name: card.name,
        imageUrl: card.image
      }));
    } catch (error) {
      console.error(`Error getting card suggestions from TCGdx:`, error);
      return [];
    }
  }

  async getCardSetById(id: string): Promise<CardSet | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/sets/${id}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const setData = await response.json();
      
      // Fetch cards in this set
      const cardsResponse = await fetch(`${this.BASE_URL}/sets/${id}/cards`);
      
      if (!cardsResponse.ok) {
        throw new Error(`Cards API request failed with status ${cardsResponse.status}`);
      }
      
      const cardsData = await cardsResponse.json();
      const cards = Array.isArray(cardsData) ? cardsData : (cardsData.data || []);
      
      const transformedSet = this.transformTcgdxSet(setData);
      transformedSet.cards = cards.map((card: any) => this.transformTcgdxCard(card));
      
      return transformedSet;
    } catch (error) {
      console.error(`Error fetching set ${id} from TCGdx:`, error);
      toast.error("Failed to load card set from TCGdx");
      return undefined;
    }
  }

  async getCardById(id: string): Promise<Pokemon | undefined> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards/${id}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const card = await response.json();
      
      return this.transformTcgdxCard(card);
    } catch (error) {
      console.error(`Error fetching card ${id} from TCGdx:`, error);
      toast.error("Failed to load card details from TCGdx");
      return undefined;
    }
  }

  async getCardsByIds(cardIds: string[]): Promise<Pokemon[]> {
    try {
      if (!cardIds.length) return [];
      
      // TCGdx might not support bulk fetching, so we'll fetch individually
      // This is not optimal but works as a fallback
      const cardPromises = cardIds.map(id => this.getCardById(id));
      const results = await Promise.allSettled(cardPromises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<Pokemon | undefined> => 
          result.status === 'fulfilled' && result.value !== undefined
        )
        .map(result => result.value as Pokemon);
    } catch (error) {
      console.error("Error fetching cards by IDs from TCGdx:", error);
      toast.error("Failed to load card details from TCGdx");
      return [];
    }
  }
}