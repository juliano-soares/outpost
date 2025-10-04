'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface SunProps {
  position?: [number, number, number];
  radius?: number;
  onSunClick?: () => void;
}

export default function Sun({ 
  position = [0, 0, 0], 
  radius = 0.5,
  onSunClick 
}: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotação do sol
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  const handleClick = () => {
    if (onSunClick) {
      onSunClick();
    }
  };

  return (
    <group position={position}>
      {/* Sol principal */}
      <Sphere 
        ref={meshRef} 
        args={[radius, 32, 32]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <meshBasicMaterial 
          color="#FFD700" 
          emissive="#FF4500" 
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Halo do sol */}
      <Sphere args={[radius * 1.2, 16, 16]}>
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Efeito de brilho */}
      <Sphere args={[radius * 1.5, 16, 16]}>
        <meshBasicMaterial 
          color="#FFA500" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
