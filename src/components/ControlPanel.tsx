// src/components/ControlPanel.tsx 
'use client';

import { useState } from 'react';
import { useLatency } from '@/context/LatencyContext';
import { EXCHANGE_LOCATIONS, CLOUD_REGIONS } from '@/data/topologyData';
import { FilterSection } from '@/components/ui/FilterSection';
import { HistoricalChartPanel } from '@/components/ui/HistoricalChartPanel'; 
import { Legend } from '@/components/ui/Legend';

export function ControlPanel() {
  const { realtimeReadings, isFetching } = useLatency();
  const [activeTab, setActiveTab] = useState<'filters' | 'history'>('filters');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Simple performance metric
  const totalConnections = realtimeReadings.length;
  const highLatencyCount = realtimeReadings.filter(r => r.status === 'HIGH').length;

  return (
    <div 
      className={`absolute top-0 right-0 z-20 h-full bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl text-white 
                  shadow-2xl shadow-black/50 transition-all duration-500 ease-in-out overflow-y-auto
                  ${isPanelOpen ? 'w-full max-w-sm md:max-w-md' : 'w-0'}
                  border-l border-gray-700/50`}
    >
      {/* Panel Toggle Button */}
      <button 
        onClick={() => setIsPanelOpen(!isPanelOpen)} 
        className={`absolute -left-12 top-1/2 transform -translate-y-1/2 p-3 
                   bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                   text-white rounded-l-xl transition-all duration-300 z-30 shadow-2xl border border-cyan-400/20
                   hover:scale-110 active:scale-95 cursor-pointer ${isPanelOpen ? '' : 'rounded-r-xl'}`}
        aria-label={isPanelOpen ? "Close Panel" : "Open Panel"}
      >
        <div className="transform transition-transform duration-300 w-4 h-4 flex items-center justify-center">
          {isPanelOpen ? '←' : '→'}
        </div>
      </button>

      {isPanelOpen && (
        <div className="p-6 space-y-8 w-full max-w-sm md:max-w-md">
          {/* Main Title */}
          <div className="text-center pb-4 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Topology Controls
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-light">Real-time Infrastructure Monitoring</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50 shadow-inner">
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'filters' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🎛️ Filters
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📊 Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'filters' && (
              // Passing imported data to the FilterSection
              <FilterSection exchanges={EXCHANGE_LOCATIONS} regions={CLOUD_REGIONS} />
            )}
            {activeTab === 'history' && (
              <HistoricalChartPanel />
            )}
          </div>
          
          <Legend />

          {/* Performance Metrics Dashboard */}
          <div className="pt-6 border-t border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              System Status
            </h3>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl space-y-4 border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Total Connections</span>
                </div>
                <span className="font-bold text-white text-lg bg-blue-500/20 px-3 py-1 rounded-full">
                  {totalConnections}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">High Latency</span>
                </div>
                <span className={`font-bold text-lg px-3 py-1 rounded-full ${
                  highLatencyCount > 0 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {highLatencyCount}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isFetching ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                  <span className="text-sm text-gray-300">Data Status</span>
                </div>
                <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                  isFetching 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {isFetching ? '🔄 Updating...' : '✅ Live Feed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}