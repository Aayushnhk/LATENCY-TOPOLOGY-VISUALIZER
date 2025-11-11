// src/components/LatencyConnection.tsx 

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LatencyReading, LATENCY_COLORS } from '@/utils/latencySimulator';
import { Line, LineDashedMaterial } from 'three'; 

interface LatencyConnectionProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  reading: LatencyReading;
}

const ARC_HEIGHT = 0.5; 
const ANIMATION_SPEED = 0.5;

export function LatencyConnection({ startPos, endPos, reading }: LatencyConnectionProps) {
  const lineRef = useRef<Line | null>(null); 
  
  // 1. Calculate the Arc/Curve
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(...endPos);
    
    const midPoint = start.clone().lerp(end, 0.5);
    
    // Adjust midpoint away from the globe center to create the arc
    const midLength = midPoint.length();
    midPoint.normalize().multiplyScalar(midLength + ARC_HEIGHT);

    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [startPos, endPos]);

  // 2. Animate the Line (Pulse Effect)
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.material as LineDashedMaterial & { dashOffset?: number }; 
      
      const time = clock.getElapsedTime() * ANIMATION_SPEED;
      const patternSpeed = reading.ms / 100; 

      material.dashOffset = time * patternSpeed; 
    }
  });

  // 3. Determine Color and Width based on Latency Status
  const color = LATENCY_COLORS[reading.status];
  
  const lineWidth = reading.status === 'HIGH' ? 6 : 2; 

  // Prepare geometry points for the line
  const points = useMemo(() => curve.getPoints(50), [curve]);

  return (
    <primitive
      object={new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineDashedMaterial({
          color,
          // Use the calculated width
          linewidth: lineWidth, 
          dashSize: 0.15, 
          gapSize: 0.15,
          transparent: true,
          opacity: 0.9, 
        })
      )}
      ref={lineRef}
    />
  );
}