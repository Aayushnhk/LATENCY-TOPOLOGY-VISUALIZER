// src/utils/coordinates.ts

/**
 * Converts geographical latitude and longitude to 3D Cartesian coordinates (x, y, z) 
 * on the surface of a sphere.
 * * @param lat - Latitude in degrees.
 * @param lon - Longitude in degrees.
 * @param radius - The radius of the sphere (must match the sphere in ThreeScene.tsx).
 * @returns A tuple [x, y, z] representing the 3D coordinates.
 */
export const latLonToVector3 = (lat: number, lon: number, radius: number): [number, number, number] => {
    // Convert degrees to radians
    const latRad = lat * (Math.PI / 180);
    const lonRad = -lon * (Math.PI / 180); // Negative for standard Three.js orientation

    // Spherical to Cartesian conversion formulas
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);

    return [x, y, z];
};

// Define the radius used in the ThreeScene component 
export const GLOBE_RADIUS = 1.5;