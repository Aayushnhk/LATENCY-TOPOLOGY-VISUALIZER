// src/context/FilterContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CloudProvider } from '@/data/topologyData';

// --- Types ---
interface FilterContextType {
  // Filters
  activeProviders: CloudProvider[];
  activeExchanges: string[]; // IDs of visible exchanges
  
  // Toggles 
  showConnections: boolean;
  showHistoricalPanel: boolean;
  
  // Actions
  toggleProvider: (provider: CloudProvider) => void;
  toggleExchange: (exchangeId: string) => void;
  toggleConnections: () => void;
  // Note: Historical Panel visibility is handled by the ControlPanel tab state
}

// --- Context ---
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// --- Provider Component ---
interface FilterProviderProps {
  children: ReactNode;
  initialProviders: CloudProvider[]; // Pass all initial providers (AWS, GCP, Azure)
  initialExchanges: string[]; // Pass all initial exchange IDs
}

export function FilterProvider({ children, initialProviders, initialExchanges }: FilterProviderProps) {
  const [activeProviders, setActiveProviders] = useState<CloudProvider[]>(initialProviders);
  const [activeExchanges, setActiveExchanges] = useState<string[]>(initialExchanges);
  const [showConnections, setShowConnections] = useState(true);
  
  // The ControlPanel component handles the historical panel visibility, so we only need a toggle for the 3D map connections.
  const showHistoricalPanel = true; 

  const toggleProvider = (provider: CloudProvider) => {
    setActiveProviders(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider) 
        : [...prev, provider]
    );
  };
  
  const toggleExchange = (exchangeId: string) => {
    setActiveExchanges(prev => 
      prev.includes(exchangeId) 
        ? prev.filter(id => id !== exchangeId) 
        : [...prev, exchangeId]
    );
  };
  
  const toggleConnections = () => {
    setShowConnections(prev => !prev);
  };

  const value = {
    activeProviders,
    activeExchanges,
    showConnections,
    showHistoricalPanel,
    toggleProvider,
    toggleExchange,
    toggleConnections,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

// --- Custom Hook for easy consumption ---
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};