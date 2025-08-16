import React from 'react';
import { useApi } from '@/context/ApiContext';
import { ApiProvider } from '@/types/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const ApiSelector: React.FC = () => {
  const { currentProvider, setProvider, isLoading } = useApi();

  const handleProviderChange = (value: ApiProvider) => {
    setProvider(value);
  };

  const getProviderInfo = (provider: ApiProvider) => {
    switch (provider) {
      case 'pokemontcg':
        return {
          name: 'Pokemon TCG API',
          description: 'Official Pokemon TCG database with pricing',
          status: 'stable'
        };
      case 'tcgdx':
        return {
          name: 'TCGdx API',
          description: 'Multilingual Pokemon TCG database',
          status: 'beta'
        };
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">API Provider</label>
      <Select value={currentProvider} onValueChange={handleProviderChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select API provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pokemontcg">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">Pokemon TCG API</div>
                <div className="text-xs text-muted-foreground">With pricing data</div>
              </div>
              <Badge variant="secondary" className="ml-2">Stable</Badge>
            </div>
          </SelectItem>
          <SelectItem value="tcgdx">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">TCGdx API</div>
                <div className="text-xs text-muted-foreground">Multilingual support</div>
              </div>
              <Badge variant="outline" className="ml-2">Beta</Badge>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      {isLoading && (
        <div className="text-xs text-muted-foreground">
          Switching API provider...
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        Current: {getProviderInfo(currentProvider).description}
      </div>
    </div>
  );
};