// src/components/ThreeScene.tsx 
'use client'; 

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { GLOBE_RADIUS, latLonToVector3 } from '@/utils/coordinates';
import { EXCHANGE_LOCATIONS, CLOUD_REGIONS, CloudProvider } from '@/data/topologyData';
import { ExchangeMarker } from './ExchangeMarker';
import { LatencyConnection } from './LatencyConnection';
import { useLatency } from '@/context/LatencyContext';
import { useFilters } from '@/context/FilterContext';
import * as THREE from 'three'; 
import { useMemo } from 'react';

// Custom Globe component 
function Globe() {
    return (
        <mesh>
            <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
            {/* Option 1: Deep Ocean Blue (Recommended) */}
            <meshStandardMaterial 
                color="#1a237e" // Deep blue with better visibility
                metalness={0.3}
                roughness={0.6}
                wireframe={false} 
                side={THREE.BackSide} 
            /> 
        </mesh>
    );
}

export function ThreeScene() {
    const { realtimeReadings, isFetching } = useLatency();
    const { activeProviders, activeExchanges, showConnections } = useFilters();

    // Memoize the positions of all items for efficient lookup
    const positions = useMemo(() => {
        const map = new Map<string, [number, number, number]>();
        [...EXCHANGE_LOCATIONS, ...CLOUD_REGIONS].forEach(item => {
            // Offset the marker position slightly away from the sphere surface to avoid z-fighting
            const offsetRadius = GLOBE_RADIUS + 0.01; 
            map.set(item.id, latLonToVector3(item.lat, item.lon, offsetRadius));
        });
        return map;
    }, []);

    // --- Filter Logic ---
    const filteredReadings = useMemo(() => {
        if (!showConnections) return [];

        return realtimeReadings.filter(reading => {
            const exchange = EXCHANGE_LOCATIONS.find(e => e.id === reading.exchangeId);
            
            return exchange && 
                   activeProviders.includes(exchange.provider) && 
                   activeExchanges.includes(exchange.id);
        });
    }, [realtimeReadings, activeProviders, activeExchanges, showConnections]);

    const filteredExchanges = useMemo(() => {
        return EXCHANGE_LOCATIONS.filter(e => 
            activeProviders.includes(e.provider) &&
            activeExchanges.includes(e.id)
        );
    }, [activeProviders, activeExchanges]);

    const filteredRegions = useMemo(() => {
        const activeProvidersSet = new Set<CloudProvider>(activeProviders);
        
        return CLOUD_REGIONS.filter(r => 
            activeProvidersSet.has(r.provider)
        );
    }, [activeProviders]);
    
    // --- Loading/Error State ---
    if (isFetching && realtimeReadings.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-cyan-400 text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Loading Global Topology...
                  </p>
                  <p className="text-gray-400 text-sm">Initializing 3D visualization</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                // Use transparent background so HTML body background shows
                className="bg-transparent" 
            >
                {/* Lighting Setup */}
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#4F46E5" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06B6D4" />

                {/* (Stars) */}
                <Stars 
                    radius={100} 
                    depth={50} 
                    count={8000} 
                    factor={6} 
                    saturation={0.1} 
                    fade 
                    speed={2} 
                />

                {/* 3D World Map (The Globe) */}
                <Globe />

                {/* --- Latency Connections (FILTERED) --- */}
                {filteredReadings.map((reading) => {
                    const start = positions.get(reading.exchangeId);
                    const end = positions.get(reading.regionId);
                    
                    if (start && end) {
                        return (
                            <LatencyConnection 
                                key={`${reading.exchangeId}-${reading.regionId}`}
                                startPos={start}
                                endPos={end}
                                reading={reading}
                            />
                        );
                    }
                    return null;
                })}
                
                {/* Exchange Server Locations (FILTERED) */}
                {filteredExchanges.map((exchange) => (
                    <group key={exchange.id}>
                        <ExchangeMarker data={exchange} />
                    </group>
                ))}
                
                {/* Cloud Region Markers (FILTERED) */}
                {filteredRegions.map((region) => (
                    <mesh 
                        key={region.id} 
                        position={positions.get(region.id)}
                    >
                        <boxGeometry args={[0.03, 0.03, 0.03]} /> 
                        {/* Use Emissive material for a glowing effect on regions */}
                        <meshStandardMaterial 
                            color="#00ffff" // Bright Cyan
                            emissive="#00ffff" 
                            emissiveIntensity={1.5} 
                        /> 
                    </mesh>
                ))}

                {/* Camera Controls */}
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={true} 
                    enableRotate={true}
                    minDistance={2} 
                    maxDistance={8}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
                
            </Canvas>

            {/* Loading Overlay */}
            {isFetching && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-cyan-500/30">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400 text-sm font-medium">Updating data...</span>
                  </div>
                </div>
            )}
        </div>
    );
}