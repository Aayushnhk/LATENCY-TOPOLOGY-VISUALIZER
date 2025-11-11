// src/app/page.tsx 
'use client'; 

import { ThreeScene } from '@/components/ThreeScene';
import { ControlPanel } from '@/components/ControlPanel'; 
import { FilterProvider } from '@/context/FilterContext';
import { EXCHANGE_LOCATIONS, CLOUD_REGIONS, CloudProvider } from '@/data/topologyData';

// --- Extract Initial Data ---
const initialExchangeIds = EXCHANGE_LOCATIONS.map(e => e.id);
const initialProviderNames: CloudProvider[] = ['AWS', 'GCP', 'Azure']; 

export default function Home() {
  return (
    <FilterProvider 
        initialExchanges={initialExchangeIds} 
        initialProviders={initialProviderNames}
    >
      <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950"> 
        {/* 3D Scene as Background */}
        <ThreeScene /> 
        
        {/* 2D Control Panel Overlay */}
        <ControlPanel />

        {/* Placeholder for the Title/Header */}
        <div className="absolute top-6 left-6 z-10 hidden md:block">
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            Latency Topology Visualizer
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-light">Real-time crypto infrastructure latency map</p>
        </div>
      </main>
    </FilterProvider>
  );
}