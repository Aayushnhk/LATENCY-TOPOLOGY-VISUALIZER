// src/components/ui/HistoricalChartPanel.tsx
'use client';

import { useMemo, useState } from 'react';
import { useLatency } from '@/context/LatencyContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EXCHANGE_LOCATIONS, CLOUD_REGIONS } from '@/data/topologyData';

// --- Types ---
interface ConnectionPair {
  id: string;
  name: string;
}

// Time range options 
const TIME_RANGES = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

// Generate a list of all possible connection pairs for the selector
const ALL_PAIRS: ConnectionPair[] = [];
for (const exchange of EXCHANGE_LOCATIONS) {
  for (const region of CLOUD_REGIONS) {
    ALL_PAIRS.push({
      id: `${exchange.id}_to_${region.id}`,
      name: `${exchange.name} (${exchange.provider}) → ${region.code}`,
    });
  }
}

export function HistoricalChartPanel() {
  const { historicalReadings } = useLatency();
  const [selectedPairId, setSelectedPairId] = useState<string>(ALL_PAIRS[0]?.id || '');
  const [activeRange, setActiveRange] = useState<keyof typeof TIME_RANGES>('1h');

  // --- Data Processing for Chart ---
  const chartData = useMemo(() => {
    if (!selectedPairId) return { chart: [], stats: { min: 0, max: 0, avg: 0 } };

    const [exchangeId, regionId] = selectedPairId.split('_to_');
    const cutoffTime = Date.now() - TIME_RANGES[activeRange];
    
    // 1. Filter data based on selected pair and time range
    const filteredData = historicalReadings
      .filter(r => 
        r.exchangeId === exchangeId && 
        r.regionId === regionId && 
        r.timestamp >= cutoffTime
      );

    // 2. Format data for Recharts
    const formattedChartData = filteredData.map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString(),
      latency_ms: r.ms,
    }));

    // 3. Calculate statistics (min, max, average)
    const latencies = filteredData.map(r => r.ms);
    const stats = {
      min: latencies.length ? Math.min(...latencies) : 0,
      max: latencies.length ? Math.max(...latencies) : 0,
      avg: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
    };

    return { chart: formattedChartData, stats };
  }, [historicalReadings, selectedPairId, activeRange]);

  const { chart: data, stats } = chartData;

  return (
    <div className="space-y-6 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-blue-400 flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        Latency Trends
      </h3>
      
      {/* Pair Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Connection Pair</label>
        <select
          value={selectedPairId}
          onChange={(e) => setSelectedPairId(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-lg transition-all cursor-pointer"
        >
          {ALL_PAIRS.map(pair => (
            <option key={pair.id} value={pair.id} className="bg-gray-800">{pair.name}</option>
          ))}
        </select>
      </div>

      {/* Time Range Selectors */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Time Range</label>
        <div className="grid grid-cols-4 gap-2 p-1 bg-gray-700 rounded-lg shadow-inner">
          {Object.keys(TIME_RANGES).map(key => (
            <button
              key={key}
              onClick={() => setActiveRange(key as keyof typeof TIME_RANGES)}
              className={`px-3 py-2 rounded-md transition-all duration-200 font-semibold text-sm cursor-pointer
                ${
                  activeRange === key 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' 
                    : 'bg-transparent text-gray-300 hover:bg-gray-600'
                }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Latency Statistics*/}
      <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-xl border border-gray-600 shadow-xl">
        <div className="text-center p-3 bg-gray-600/50 rounded-lg">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Min</div>
          <div className="font-bold text-2xl text-green-400 mt-1">{stats.min} ms</div>
        </div>
        <div className="text-center p-3 bg-gray-600/50 rounded-lg">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Max</div>
          <div className="font-bold text-2xl text-red-400 mt-1">{stats.max} ms</div>
        </div>
        <div className="text-center p-3 bg-gray-600/50 rounded-lg">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Avg</div>
          <div className="font-bold text-2xl text-cyan-400 mt-1">{stats.avg} ms</div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <div style={{ width: '100%', height: 300 }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="time" stroke="#9CA3AF" interval="preserveStartEnd" fontSize={12} />
                <YAxis domain={['auto', 'auto']} stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563', 
                    color: '#FFF', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                  }}
                  formatter={(value: number) => [`${value} ms`, 'Latency']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend wrapperStyle={{ color: '#D1D5DB', fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="latency_ms" 
                  stroke="url(#latencyGradient)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 4, fill: '#60A5FA' }}
                />
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400 p-6 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-lg mb-2">📊</div>
                <div>No historical data available</div>
                <div className="text-sm mt-1">for selected period</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}