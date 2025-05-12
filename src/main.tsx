
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { searchPokemonNames, formatPokemonName } from './lib/cardSearch.ts'

// Add a fetch interceptor for our mock API endpoint
const originalFetch = window.fetch;
window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  const url = input.toString();
  
  // Check if the request is for our mock API endpoint
  if (url.startsWith('/api/cards') && url.includes('query=')) {
    // Extract the query parameter
    const params = new URL(url, window.location.origin).searchParams;
    const query = params.get('query') || '';
    
    console.log(`Mock API: Searching Pokémon with query "${query}"`);
    
    // Get Pokémon name suggestions with artwork
    try {
      const suggestions = await searchPokemonNames(query);
      console.log(`Mock API: Found ${suggestions.length} Pokémon matches`);
      
      // Add formatted display names
      const enhancedSuggestions = suggestions.map(pokemon => ({
        ...pokemon,
        displayName: formatPokemonName(pokemon.name)
      }));
      
      return new Response(JSON.stringify(enhancedSuggestions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Mock API error:", error);
      return new Response(JSON.stringify({ error: 'Failed to fetch suggestions' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // For all other requests, proceed with the original fetch
  return originalFetch.call(window, input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
