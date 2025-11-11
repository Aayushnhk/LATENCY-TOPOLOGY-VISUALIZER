// src/context/LatencyContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { LatencyReading, fetchRealtimeLatencyData } from '@/utils/latencySimulator';

// --- Types ---
interface LatencyContextType {
  realtimeReadings: LatencyReading[];
  historicalReadings: LatencyReading[];
  isFetching: boolean;
  selectedPair: string | null;
  setSelectedPair: (pairId: string | null) => void;
}

// --- Context ---
const LatencyContext = createContext<LatencyContextType | undefined>(undefined);

// --- Provider Component ---
interface LatencyProviderProps {
  children: ReactNode;
}

const UPDATE_INTERVAL_MS = 7000; // Update every 7 seconds 
const MAX_HISTORICAL_POINTS = 500; // Limit historical data storage

export function LatencyProvider({ children }: LatencyProviderProps) {
  const [realtimeReadings, setRealtimeReadings] = useState<LatencyReading[]>([]);
  const [historicalReadings, setHistoricalReadings] = useState<LatencyReading[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  // Function to fetch/simulate and update all data
  const updateLatencyData = useCallback(() => {
    setIsFetching(true);
    try {
      const newReadings = fetchRealtimeLatencyData();
      setRealtimeReadings(newReadings);

      // Store historical data 
      setHistoricalReadings(prev => {
        // Only append the new readings; keep the history buffer size limited
        const newHistory = [...prev, ...newReadings];
        if (newHistory.length > MAX_HISTORICAL_POINTS) {
          // Keep only the newest points
          return newHistory.slice(newHistory.length - MAX_HISTORICAL_POINTS);
        }
        return newHistory;
      });

    } catch (error) {
      console.error("Failed to fetch/simulate latency data:", error);
      // Implement proper error handling state here 
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Set up the real-time interval 
  useEffect(() => {
    // Fetch immediately on mount
    updateLatencyData();

    // Set up the interval for continuous updates
    const intervalId = setInterval(updateLatencyData, UPDATE_INTERVAL_MS);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [updateLatencyData]);

  return (
    <LatencyContext.Provider 
      value={{ 
        realtimeReadings, 
        historicalReadings, 
        isFetching,
        selectedPair,
        setSelectedPair 
      }}
    >
      {children}
    </LatencyContext.Provider>
  );
}

// --- Custom Hook for easy consumption ---
export const useLatency = () => {
  const context = useContext(LatencyContext);
  if (context === undefined) {
    throw new Error('useLatency must be used within a LatencyProvider');
  }
  return context;
};