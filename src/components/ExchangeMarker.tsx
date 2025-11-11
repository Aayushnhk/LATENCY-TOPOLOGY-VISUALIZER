// src/components/ExchangeMarker.tsx 
import { ExchangeLocation, CloudProvider } from '@/data/topologyData';
import { latLonToVector3, GLOBE_RADIUS } from '@/utils/coordinates';
import { useMemo } from 'react';
import { Html } from '@react-three/drei';

interface ExchangeMarkerProps {
  data: ExchangeLocation;
}

// Define brighter, high-contrast colors for each cloud provider
const PROVIDER_COLORS: Record<CloudProvider, string> = {
    AWS: '#FFC107', // Brighter Gold/Yellow
    GCP: '#18FFFF', // Bright Cyan/Aqua
    Azure: '#00BFFF', // Sky Blue
};

export function ExchangeMarker({ data }: ExchangeMarkerProps) {
  // Use useMemo to calculate the 3D position only when dependencies change
  const position = useMemo(() => {
    return latLonToVector3(data.lat, data.lon, GLOBE_RADIUS + 0.01);
  }, [data.lat, data.lon]);

  const color = PROVIDER_COLORS[data.provider];

  return (
    <group position={position}>
      {/* 1. The 3D Marker (Small Sphere) */}
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        {/* Use meshStandardMaterial with emissive property for a subtle glow in 3D */}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
      
      {/* 2. The Information/Tooltip on Hover */}
      <Html 
        distanceFactor={5} 
        position={[0, 0.05, 0]}
      >
        {/* Tooltip Style: dark background, sharp border, shadow */}
        <div className="tooltip-container invisible group-hover:visible absolute left-full ml-3 p-4 
                        bg-gradient-to-br from-gray-800 to-gray-900 text-white text-sm font-semibold rounded-xl 
                        border border-cyan-500/30 shadow-2xl backdrop-blur-sm
                        whitespace-nowrap pointer-events-none transition-all duration-300 
                        opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 -translate-x-2">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full border border-white/20 shadow-lg" 
              style={{ backgroundColor: color }}
            ></div>
            <strong className="text-cyan-300 text-base">{data.name}</strong>
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Provider:</span>
              <span className="text-gray-200 font-medium">{data.provider}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Location:</span>
              <span className="text-gray-200">{data.location}</span>
            </div>
          </div>
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-lg"></div>
        </div>
      </Html>
    </group>
  );
}