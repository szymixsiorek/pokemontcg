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
  region: "jp" | "en";
  series: string;
}

// Mock data for card sets
const jpCardSets: CardSet[] = [
  {
    id: "jp-sv1",
    name: "Scarlet & Violet",
    nameJp: "スカーレット&バイオレット",
    logo: "https://jp.pokellector.com/sets/SV1-Violet-71",
    symbol: "https://jp.pokellector.com/images/sets/Japanese/SV1.png",
    releaseDate: "2023-01-20",
    cardCount: 198,
    region: "jp",
    series: "Scarlet & Violet",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `jp-sv1-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/sv1/${i + 1}.png`,
      number: `${i + 1}/198`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "jp-swsh12",
    name: "VSTAR Universe",
    nameJp: "VSTARユニバース",
    logo: "https://jp.pokellector.com/sets/VSTAR-Universe-60",
    symbol: "https://jp.pokellector.com/images/sets/Japanese/VSTAR.png",
    releaseDate: "2022-12-02",
    cardCount: 165,
    region: "jp",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `jp-swsh12-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh12/${i + 1}.png`,
      number: `${i + 1}/165`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "jp-swsh11",
    name: "VMAX Climax",
    nameJp: "VMAXクライマックス",
    logo: "https://jp.pokellector.com/sets/VMAX-Climax-57",
    symbol: "https://jp.pokellector.com/images/sets/Japanese/VMAX-Climax.png", 
    releaseDate: "2021-12-03",
    cardCount: 184,
    region: "jp",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `jp-swsh11-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh11/${i + 1}.png`,
      number: `${i + 1}/184`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "jp-s8b",
    name: "Blue Sky Stream",
    nameJp: "蒼空ストリーム",
    logo: "https://jp.pokellector.com/sets/S8b-Blue-Sky-Stream-54",
    symbol: "https://jp.pokellector.com/images/sets/Japanese/S8b.png",
    releaseDate: "2021-07-09",
    cardCount: 76,
    region: "jp",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `jp-s8b-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/s8b/${i + 1}.png`,
      number: `${i + 1}/76`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "jp-sm12a",
    name: "Tag All Stars",
    nameJp: "タッグオールスターズ",
    logo: "https://jp.pokellector.com/sets/TAG-TEAM-All-Stars-43",
    symbol: "https://jp.pokellector.com/images/sets/Japanese/TAG-TEAM-All-Stars.png",
    releaseDate: "2019-10-04",
    cardCount: 173,
    region: "jp",
    series: "Sun & Moon",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `jp-sm12a-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/sm12a/${i + 1}.png`,
      number: `${i + 1}/173`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
];

const enCardSets: CardSet[] = [
  {
    id: "sv01",
    name: "Scarlet & Violet",
    nameJp: "スカーレット&バイオレット",
    logo: "https://www.pokellector.com/sets/SV1-Scarlet-Violet",
    symbol: "https://www.pokellector.com/images/sets/SV1.png",
    releaseDate: "2023-03-31",
    cardCount: 258,
    region: "en",
    series: "Scarlet & Violet",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-sv1-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/sv1/${i + 1}.png`,
      number: `${i + 1}/258`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
  {
    id: "swsh12",
    name: "Silver Tempest",
    nameJp: "シルバーテンペスト",
    logo: "https://www.pokellector.com/sets/SIT-Silver-Tempest",
    symbol: "https://www.pokellector.com/images/sets/SIT.png",
    releaseDate: "2022-11-11",
    cardCount: 195,
    region: "en",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-swsh12-${i + 1}`,
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
    logo: "https://www.pokellector.com/sets/LOR-Lost-Origin",
    symbol: "https://www.pokellector.com/images/sets/LOR.png",
    releaseDate: "2022-09-09",
    cardCount: 196,
    region: "en",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-swsh11-${i + 1}`,
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
    logo: "https://www.pokellector.com/sets/ASR-Astral-Radiance",
    symbol: "https://www.pokellector.com/images/sets/ASR.png",
    releaseDate: "2022-05-27",
    cardCount: 189,
    region: "en",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-swsh10-${i + 1}`,
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
    logo: "https://www.pokellector.com/sets/BRS-Brilliant-Stars",
    symbol: "https://www.pokellector.com/images/sets/BRS.png",
    releaseDate: "2022-02-25",
    cardCount: 172,
    region: "en",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-swsh9-${i + 1}`,
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
    logo: "https://www.pokellector.com/sets/FST-Fusion-Strike",
    symbol: "https://www.pokellector.com/images/sets/FST.png",
    releaseDate: "2021-11-12",
    cardCount: 264,
    region: "en",
    series: "Sword & Shield",
    cards: Array.from({ length: 12 }, (_, i) => ({
      id: `en-swsh8-${i + 1}`,
      name: `Pokemon ${i + 1}`,
      image: `https://images.pokemontcg.io/swsh8/${i + 1}.png`,
      number: `${i + 1}/264`,
      rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
      type: ["Fire", "Water", "Grass", "Electric", "Psychic"][Math.floor(Math.random() * 5)]
    }))
  },
];

// Get all card sets
export const getCardSets = async (region: "jp" | "en" = "jp"): Promise<CardSet[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return region === "jp" ? jpCardSets : enCardSets;
};

// Get a specific card set by ID
export const getCardSetById = async (id: string): Promise<CardSet | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...jpCardSets, ...enCardSets].find(set => set.id === id);
};

// Get sets grouped by series
export const getCardSetsBySeries = async (region: "jp" | "en" = "jp"): Promise<Record<string, CardSet[]>> => {
  const sets = region === "jp" ? jpCardSets : enCardSets;
  return sets.reduce((acc, set) => {
    if (!acc[set.series]) {
      acc[set.series] = [];
    }
    acc[set.series].push(set);
    return acc;
  }, {} as Record<string, CardSet[]>);
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
