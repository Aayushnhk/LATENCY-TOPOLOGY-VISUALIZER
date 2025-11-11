// src/utils/latencySimulator.ts

import { EXCHANGE_LOCATIONS, CLOUD_REGIONS } from '@/data/topologyData';

// 1. Define Latency Status and Color Ranges
export type LatencyStatus = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LatencyReading {
  exchangeId: string;
  regionId: string;
  ms: number; // Latency in milliseconds
  status: LatencyStatus;
  timestamp: number;
}

// Latency thresholds (in ms)
const THRESHOLDS = {
    LOW: 20, // < 20ms
    MEDIUM: 80, // 20ms to 80ms
};

/**
 * Determines the status based on the latency value.
 */
const getStatus = (ms: number): LatencyStatus => {
    if (ms < THRESHOLDS.LOW) return 'LOW';
    if (ms < THRESHOLDS.MEDIUM) return 'MEDIUM';
    return 'HIGH';
};

/**
 * Generates a mock latency value based on proximity and general ranges.
 */
const generateMockLatency = (isLocal: boolean): number => {
    // Local connections (e.g., within the same continent) are generally fast
    if (isLocal) {
        return Math.floor(Math.random() * 30) + 5; // 5ms - 35ms (Mostly LOW/Medium)
    }
    // Cross-continent connections are slower
    return Math.floor(Math.random() * 150) + 50; // 50ms - 200ms (Medium/HIGH)
};

/**
 * Simulates a fetch for all real-time latency connections.
 */
export const fetchRealtimeLatencyData = (): LatencyReading[] => {
    const readings: LatencyReading[] = [];
    const timestamp = Date.now();

    // Iterate over every exchange
    for (const exchange of EXCHANGE_LOCATIONS) {
        // Assume every exchange connects to every cloud region for a full topology demo
        for (const region of CLOUD_REGIONS) {
            
            // Simple logic to simulate "local" vs "global" latency
            const isLocal = exchange.location[0] === region.name[0]; 

            const ms = generateMockLatency(isLocal);
            
            readings.push({
                exchangeId: exchange.id,
                regionId: region.id,
                ms,
                status: getStatus(ms),
                timestamp,
            });
        }
    }
    return readings;
};

// Map status to a visual color (for use in both 3D visualization and UI)
export const LATENCY_COLORS: Record<LatencyStatus, string> = {
    LOW: 'green',    // Low Latency
    MEDIUM: 'yellow', // Medium Latency
    HIGH: 'red',     // High Latency
};