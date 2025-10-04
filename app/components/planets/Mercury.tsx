'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MercuryProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Mercury({ position = [0, 0, 0], rotation = [0, 0, 0] }: MercuryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Criar textura procedural para a Terra
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Criar gradiente para simular oceanos e continentes
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1e3a8a'); // Azul oceano
    gradient.addColorStop(0.3, '#3b82f6');
    gradient.addColorStop(0.5, '#10b981'); // Verde continentes
    gradient.addColorStop(0.7, '#f59e0b'); // Marrom desertos
    gradient.addColorStop(1, '#1e3a8a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Adicionar algumas "ilhas" e continentes
    ctx.fillStyle = '#059669';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const size = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Rotação automática da Terra
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Terra */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhongMaterial map={earthTexture} />
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
