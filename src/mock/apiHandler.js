
// This is a mock implementation for the /api/cards endpoint
// In a real application, this would be replaced by a server endpoint

// Sample data for demonstration
const sampleCards = [
  { id: "swsh1-1", name: "Celebi V", imageUrl: "https://images.pokemontcg.io/swsh1/1.png" },
  { id: "swsh1-2", name: "Snorlax V", imageUrl: "https://images.pokemontcg.io/swsh1/2.png" },
  { id: "swsh1-3", name: "Eldegoss V", imageUrl: "https://images.pokemontcg.io/swsh1/3.png" },
  { id: "swsh1-4", name: "Dhelmise V", imageUrl: "https://images.pokemontcg.io/swsh1/4.png" },
  { id: "swsh1-5", name: "Lapras V", imageUrl: "https://images.pokemontcg.io/swsh1/5.png" },
  { id: "swsh1-6", name: "Lapras VMAX", imageUrl: "https://images.pokemontcg.io/swsh1/6.png" },
  { id: "swsh1-7", name: "Morpeko V", imageUrl: "https://images.pokemontcg.io/swsh1/7.png" },
  { id: "swsh1-8", name: "Morpeko VMAX", imageUrl: "https://images.pokemontcg.io/swsh1/8.png" },
  { id: "swsh1-9", name: "Pikachu V", imageUrl: "https://images.pokemontcg.io/swsh1/9.png" },
  { id: "swsh1-10", name: "Tapu Koko V", imageUrl: "https://images.pokemontcg.io/swsh1/10.png" },
  { id: "swsh1-11", name: "Zacian V", imageUrl: "https://images.pokemontcg.io/swsh1/11.png" },
  { id: "swsh1-12", name: "Zamazenta V", imageUrl: "https://images.pokemontcg.io/swsh1/12.png" },
  { id: "swsh1-13", name: "Caterpie", imageUrl: "https://images.pokemontcg.io/swsh1/13.png" },
  { id: "swsh1-14", name: "Metapod", imageUrl: "https://images.pokemontcg.io/swsh1/14.png" },
  { id: "swsh1-15", name: "Butterfree", imageUrl: "https://images.pokemontcg.io/swsh1/15.png" },
];

// Mock API handler function
export const mockSearchCards = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Filter cards by name match
  const filteredCards = sampleCards.filter(card => 
    card.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredCards;
};

// Setup mock API endpoint
export const setupMockAPI = () => {
  // Override fetch for our specific endpoint
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    if (typeof input === 'string' && input.startsWith('/api/cards')) {
      const url = new URL(input, window.location.origin);
      const query = url.searchParams.get('query') || '';
      const results = await mockSearchCards(query);
      
      return {
        ok: true,
        json: async () => results,
      };
    }
    
    // For all other requests, use the original fetch
    return originalFetch.call(this, input, init);
  };
  
  console.log('Mock API for card search has been set up');
};

// Initialize the mock API
if (import.meta.env.DEV) {
  setupMockAPI();
}
