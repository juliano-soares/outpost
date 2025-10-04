'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  rotationSpeed?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  onPlanetClick?: (planetName: string) => void;
  showLabel?: boolean;
}

export default function Planet({ 
  name, 
  position, 
  radius, 
  color, 
  rotationSpeed = 0.1,
  orbitSpeed = 0,
  orbitRadius = 0,
  onPlanetClick,
  showLabel = true
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  

  // Rotação do planeta
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    
    // Órbita ao redor do sol (se especificado)
    if (groupRef.current && orbitSpeed > 0) {
      groupRef.current.rotation.y += delta * orbitSpeed;
    }
  });

  const handleClick = () => {
    if (onPlanetClick) {
      onPlanetClick(name);
    }
  };

  return (
    <group ref={groupRef} position={position}>
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
        <meshBasicMaterial color={color} />
      </Sphere>
      
      {/* Atmosfera para alguns planetas */}
      {(name.toLowerCase() === 'earth' || name.toLowerCase() === 'venus') && (
        <Sphere args={[radius * 1.1, 16, 16]}>
          <meshBasicMaterial 
            color={name.toLowerCase() === 'earth' ? '#87CEEB' : '#FFE4B5'} 
            transparent 
            opacity={0.1} 
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Anéis de Saturno */}
      {name.toLowerCase() === 'saturn' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.5, 32]} />
          <meshBasicMaterial 
            color="#d2b48c" 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Label do planeta */}
      {showLabel && (
        <Text
          position={[0, radius + 0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}
