import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiProvider, ApiService } from '@/types/api';
import { PokemonTcgApiService } from '@/lib/pokemontcg-api';
import { TcgdxApiService } from '@/lib/tcgdx-api';

interface ApiContextType {
  currentProvider: ApiProvider;
  setProvider: (provider: ApiProvider) => void;
  apiService: ApiService;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiContextProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [currentProvider, setCurrentProvider] = useState<ApiProvider>('pokemontcg');
  const [apiService, setApiService] = useState<ApiService>(new PokemonTcgApiService());
  const [isLoading, setIsLoading] = useState(false);

  const setProvider = async (provider: ApiProvider) => {
    if (provider === currentProvider) return;
    
    setIsLoading(true);
    
    try {
      let newService: ApiService;
      
      switch (provider) {
        case 'tcgdx':
          newService = new TcgdxApiService();
          break;
        case 'pokemontcg':
        default:
          newService = new PokemonTcgApiService();
          break;
      }
      
      setApiService(newService);
      setCurrentProvider(provider);
      
      // Store preference in localStorage
      localStorage.setItem('preferred-api-provider', provider);
    } catch (error) {
      console.error('Error switching API provider:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved preference on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('preferred-api-provider') as ApiProvider;
    if (savedProvider && savedProvider !== currentProvider) {
      setProvider(savedProvider);
    }
  }, []);

  return (
    <ApiContext.Provider value={{
      currentProvider,
      setProvider,
      apiService,
      isLoading
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiContextProvider');
  }
  return context;
};