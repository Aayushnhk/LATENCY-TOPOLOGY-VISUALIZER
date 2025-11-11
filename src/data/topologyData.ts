// src/data/topologyData.ts

// 1. Data Types for strong typing
export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export interface ExchangeLocation {
  id: string;
  name: string;
  location: string;
  provider: CloudProvider;
  lat: number;
  lon: number;
}

export interface CloudRegion {
    id: string;
    name: string;
    provider: CloudProvider;
    code: string;
    lat: number;
    lon: number;
}

// 2. Exchange Server Locations (Mocked Co-location Points)
export const EXCHANGE_LOCATIONS: ExchangeLocation[] = [
    // Binance/AWS - North America
    { id: 'binance_us_e', name: 'Binance US', location: 'Virginia, USA', provider: 'AWS', lat: 39.0437, lon: -77.4875 },
    // OKX/GCP - Europe
    { id: 'okx_eu_w', name: 'OKX', location: 'London, UK', provider: 'GCP', lat: 51.5072, lon: 0.1276 },
    // Bybit/Azure - Asia
    { id: 'bybit_asia_e', name: 'Bybit', location: 'Tokyo, Japan', provider: 'Azure', lat: 35.6895, lon: 139.6917 },
    // Deribit/AWS - Europe (Netherlands)
    { id: 'deribit_eu', name: 'Deribit', location: 'Amsterdam, NL', provider: 'AWS', lat: 52.3676, lon: 4.9041 },
    // Coinbase/AWS - Ireland
    { id: 'coinbase_eu', name: 'Coinbase', location: 'Dublin, IE', provider: 'AWS', lat: 53.3498, lon: -6.2603 },
    // Kucoin/GCP - Singapore
    { id: 'kucoin_asia_s', name: 'Kucoin', location: 'Singapore', provider: 'GCP', lat: 1.3521, lon: 103.8198 },
];

// 3. Cloud Region Locations (Simplified Central Points)
export const CLOUD_REGIONS: CloudRegion[] = [
    { id: 'aws_us_e', name: 'AWS N. Virginia', provider: 'AWS', code: 'us-east-1', lat: 38.9072, lon: -77.0369 },
    { id: 'gcp_eu_w', name: 'GCP London', provider: 'GCP', code: 'europe-west2', lat: 51.5074, lon: 0.1278 },
    { id: 'azure_asia_e', name: 'Azure Japan East', provider: 'Azure', code: 'japaneast', lat: 35.6895, lon: 139.6917 },
    { id: 'aws_eu_w', name: 'AWS Ireland', provider: 'AWS', code: 'eu-west-1', lat: 53.3498, lon: -6.2603 },
    { id: 'gcp_asia_s', name: 'GCP Singapore', provider: 'GCP', code: 'asia-southeast1', lat: 1.3521, lon: 103.8198 },
];