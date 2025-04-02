
// This is a mock API service for Pokemon TCG data
// This would be replaced with actual API calls to a backend service

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  number: string;
  rarity: string;
  type: string;
}

export interface CardSet {
  id: string;
  name: string;
  nameJp: string;
  logo: string;
  symbol: string;
  releaseDate: string;
  cardCount: number;
  cards: Pokemon[];
}

// Mock data for card sets
const cardSets: CardSet[] = [
  {
    id: "sv1",
    name: "Scarlet & Violet",
    nameJp: "スカーレット&バイオレット",
    logo: "https://images.pokemontcg.io/sv1/logo.png",
    symbol: "https://images.pokemontcg.io/sv1/symbol.png",
    releaseDate: "2023-01-20",
    cardCount: 198,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `sv1-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/sv1/${i + 1}.png`,
      number: `${i + 1}/198`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh12",
    name: "Silver Tempest",
    nameJp: "シルバーテンペスト",
    logo: "https://images.pokemontcg.io/swsh12/logo.png",
    symbol: "https://images.pokemontcg.io/swsh12/symbol.png",
    releaseDate: "2022-11-11",
    cardCount: 195,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `swsh12-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh12/${i + 1}.png`,
      number: `${i + 1}/195`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh11",
    name: "Lost Origin",
    nameJp: "ロストアビス",
    logo: "https://images.pokemontcg.io/swsh11/logo.png",
    symbol: "https://images.pokemontcg.io/swsh11/symbol.png",
    releaseDate: "2022-09-09",
    cardCount: 196,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `swsh11-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh11/${i + 1}.png`,
      number: `${i + 1}/196`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh10",
    name: "Astral Radiance",
    nameJp: "アストラルレイズ",
    logo: "https://images.pokemontcg.io/swsh10/logo.png",
    symbol: "https://images.pokemontcg.io/swsh10/symbol.png",
    releaseDate: "2022-05-27",
    cardCount: 189,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `swsh10-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh10/${i + 1}.png`,
      number: `${i + 1}/189`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh9",
    name: "Brilliant Stars",
    nameJp: "ブリリアントスターズ",
    logo: "https://images.pokemontcg.io/swsh9/logo.png",
    symbol: "https://images.pokemontcg.io/swsh9/symbol.png",
    releaseDate: "2022-02-25",
    cardCount: 172,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `swsh9-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh9/${i + 1}.png`,
      number: `${i + 1}/172`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh8",
    name: "Fusion Strike",
    nameJp: "フュージョンアーツ",
    logo: "https://images.pokemontcg.io/swsh8/logo.png",
    symbol: "https://images.pokemontcg.io/swsh8/symbol.png",
    releaseDate: "2021-11-12",
    cardCount: 264,
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `swsh8-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh8/${i + 1}.png`,
      number: `${i + 1}/264`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
];

// Get all card sets
export const getCardSets = async (): Promise<CardSet[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return cardSets;
};

// Get a specific card set by ID
export const getCardSetById = async (id: string): Promise<CardSet | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return cardSets.find(set => set.id === id);
};

// Mock user collection service
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
  }
};

// Remove card from collection
export const removeCardFromCollection = async (userId: string, cardId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (userCollection[userId]) {
    userCollection[userId] = userCollection[userId].filter(id => id !== cardId);
  }
};
