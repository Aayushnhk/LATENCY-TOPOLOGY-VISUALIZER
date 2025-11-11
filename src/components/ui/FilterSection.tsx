// src/components/ui/FilterSection.tsx
'use client';

import { CloudProvider, ExchangeLocation, CloudRegion } from '@/data/topologyData';
import { useFilters } from '@/context/FilterContext';
import { useMemo } from 'react';


interface FilterSectionProps {
    exchanges: ExchangeLocation[];
    regions: CloudRegion[];
}

// Define all possible providers dynamically
const ALL_PROVIDERS: CloudProvider[] = ['AWS', 'GCP', 'Azure'];

// REQUIRED: Accepting the props in the function signature
export function FilterSection({ exchanges, regions }: FilterSectionProps) { 
    const { 
        activeProviders, 
        activeExchanges, 
        showConnections, 
        toggleProvider, 
        toggleExchange,
        toggleConnections 
    } = useFilters();

    // Group exchanges by provider for organized display
    const exchangesByProvider = useMemo(() => {
        // Use the passed 'exchanges' prop
        return exchanges.reduce((acc, exchange) => {
            if (!acc[exchange.provider]) {
                acc[exchange.provider] = [];
            }
            acc[exchange.provider].push(exchange);
            return acc;
        }, {} as Record<CloudProvider, typeof exchanges>);
    }, [exchanges]);

    return (
        <div className="space-y-6">
            
            {/* 1. Visualization Toggles */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                <h4 className="font-bold text-lg text-blue-400 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Visualization Layers
                </h4>
                <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex-1 min-w-0">
                        <span className="text-gray-200 font-medium block truncate">Real-time Connections</span>
                        <span className="text-gray-400 text-sm truncate">Show latency connections</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={showConnections}
                            onChange={toggleConnections} 
                        />
                        {/* Enhanced Toggle Switch Style */}
                        <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner cursor-pointer"></div>
                    </label>
                </div>
            </div>

            {/* 2. Cloud Provider Filters */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                <h4 className="font-bold text-lg text-blue-400 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Cloud Providers
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    {ALL_PROVIDERS.map(provider => (
                        <button
                            key={provider}
                            onClick={() => toggleProvider(provider)}
                            className={`p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border-2 cursor-pointer
                                ${
                                    activeProviders.includes(provider) 
                                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-400 shadow-blue-500/25' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            {provider}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Exchange Filters */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
                <h4 className="font-bold text-lg text-blue-400 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Exchange Servers
                </h4>
                <div className="space-y-4">
                    {ALL_PROVIDERS.map(provider => (
                        <div key={provider} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                            <h5 className="text-sm font-bold mb-3 text-cyan-300 uppercase tracking-wide truncate">{provider} Co-locations</h5>
                            <div className="flex flex-wrap gap-2">
                                {exchangesByProvider[provider]?.map(exchange => (
                                    <button
                                        key={exchange.id}
                                        onClick={() => toggleExchange(exchange.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md border cursor-pointer
                                            ${
                                                activeExchanges.includes(exchange.id)
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300 shadow-green-500/25'
                                                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500 hover:border-gray-400'
                                            }`}
                                    >
                                        {exchange.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}