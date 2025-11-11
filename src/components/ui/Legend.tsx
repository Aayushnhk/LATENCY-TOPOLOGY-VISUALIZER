// src/components/ui/Legend.tsx (Fixed)
'use client';

import { LATENCY_COLORS } from '@/utils/latencySimulator';

export function Legend() {
  return (
    <div className="pt-6 border-t border-gray-700 mt-6 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      {/* Enhanced heading style */}
      <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
        Latency Legend
      </h3>
      
      {/* Fixed: Grid layout for better text fitting */}
      <div className="grid grid-cols-2 gap-3 bg-gray-700/50 p-4 rounded-xl border border-gray-600 shadow-lg">
        {Object.entries(LATENCY_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center space-x-3 p-2 bg-gray-600/30 rounded-lg border border-gray-500">
            {/* The colored circle with glow effect */}
            <span 
                className="w-4 h-4 rounded-full shadow-lg border border-white/20 flex-shrink-0" 
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}40`
                }}
            ></span>
            {/* The status text with better spacing */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-gray-200 font-semibold text-sm truncate">
                {status === 'OPTIMAL' ? 'Optimal' : 
                 status === 'GOOD' ? 'Good' : 
                 status === 'MODERATE' ? 'Moderate' : 
                 status === 'HIGH' ? 'High' : status}
              </span>
              <span className="text-gray-400 text-xs">
                {status === 'OPTIMAL' && '< 50ms'}
                {status === 'GOOD' && '50-100ms'}
                {status === 'MODERATE' && '100-200ms'}
                {status === 'HIGH' && '> 200ms'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced marker legend */}
      <div className="mt-6 bg-gray-700/30 rounded-lg p-4 border border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Marker Types</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-md flex-shrink-0"></div>
            <span className="text-gray-400 truncate">Sphere (Exchange)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded shadow-md flex-shrink-0"></div>
            <span className="text-gray-400 truncate">Cube (Cloud Region)</span>
          </div>
        </div>
      </div>

      {/* Connection quality indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-700/50 px-4 py-2 rounded-full border border-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
          <span className="text-gray-300 text-sm">Real-time data streaming active</span>
        </div>
      </div>
    </div>
  );
}