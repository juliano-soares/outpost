'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface SaturnProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Saturn({ position = [0, 0, 0], rotation = [0, 0, 0] }: SaturnProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  

  // Rotação automática da Terra
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Terra */}
      <Sphere ref={meshRef} args={[1, 32, 32]}>
        <meshBasicMaterial color="#4a90e2" />
      </Sphere>
      
      {/* Atmosfera */}
      <Sphere args={[1.05, 32, 32]}>
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Nuvens */}
      <Sphere args={[1.02, 32, 32]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  );
}
