'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import CameraControls from './controls/CameraControls';

export default function SpaceScene() {
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);

  const handlePlanetClick = (planetName: string) => {
    setFocusedPlanet(planetName);
    
    // Posições dos planetas para foco
    const planetPositions: { [key: string]: [number, number, number] } = {
      'Sun': [0, 0, 0],
      'Mercury': [2, 0, 0],
      'Venus': [3, 0, 0],
      'Earth': [4, 0, 0],
      'Mars': [5.5, 0, 0],
      'Jupiter': [8, 0, 0],
      'Saturn': [12, 0, 0]
    };

    const position = planetPositions[planetName];
    if (position) {
      setFocusTarget(position);
    }
  };

  const handleFocusComplete = () => {
    setFocusTarget(null);
  };

  const handleExitFocus = () => {
    setFocusTarget(null);
    setFocusedPlanet(null);
  };

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ 
          position: [4, 0, 3], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
      >
        {/* Iluminação básica */}
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Estrelas de fundo */}
        <Stars 
          radius={200} 
          depth={100} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
        />

        {/* Sol */}
        <mesh position={[0, 0, 0]} onClick={() => handlePlanetClick('Sun')}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>

        {/* Mercúrio */}
        <mesh position={[2, 0, 0]} onClick={() => handlePlanetClick('Mercury')}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#8c7853" />
        </mesh>

        {/* Vênus */}
        <mesh position={[3, 0, 0]} onClick={() => handlePlanetClick('Venus')}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffc649" />
        </mesh>

        {/* Terra */}
        <mesh position={[4, 0, 0]} onClick={() => handlePlanetClick('Earth')}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#4a90e2" />
        </mesh>

        {/* Marte */}
        <mesh position={[5.5, 0, 0]} onClick={() => handlePlanetClick('Mars')}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#cd5c5c" />
        </mesh>

        {/* Júpiter */}
        <mesh position={[8, 0, 0]} onClick={() => handlePlanetClick('Jupiter')}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#d2691e" />
        </mesh>

        {/* Saturno */}
        <mesh position={[12, 0, 0]} onClick={() => handlePlanetClick('Saturn')}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#fad5a5" />
        </mesh>

        {/* Indicador de posição da câmera (temporário para debug) */}
        <mesh position={[4, 0, 3]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {/* Controles unificados (mouse, teclado e foco) */}
        <CameraControls 
          target={[4, 0, 0]}
          distance={3}
          minDistance={1}
          maxDistance={30}
          focusTarget={focusTarget}
          onFocusComplete={handleFocusComplete}
        />
      </Canvas>
      
      {/* Instruções de controle */}
      <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-2">Sistema Solar 3D</h3>
        <div className="text-sm space-y-1">
          <p><strong>Mouse Esquerdo:</strong> Arrastar para rotacionar</p>
          <p><strong>Mouse Direito:</strong> Arrastar para pan (mover)</p>
          <p><strong>Scroll:</strong> Zoom in/out</p>
          <p><strong>WASD:</strong> Movimento livre</p>
          <p><strong>Q/E:</strong> Subir/Descer</p>
          <p><strong>Z/X:</strong> Zoom rápido</p>
          <p><strong>Clique no planeta:</strong> Focar</p>
        </div>
      </div>
      
      {/* Informações do planeta focado */}
      {focusedPlanet && (
        <div className="absolute top-4 right-4 text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">🌍 {focusedPlanet}</h3>
            <button 
              onClick={handleExitFocus}
              className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            >
              ✕ Sair
            </button>
          </div>
          <div className="text-sm space-y-1">
            {focusedPlanet === 'Sun' && (
              <>
                <p>Estrela central do sistema solar</p>
                <p>Temperatura: ~5,500°C</p>
              </>
            )}
            {focusedPlanet === 'Mercury' && (
              <>
                <p>Planeta mais próximo do Sol</p>
                <p>Sem atmosfera significativa</p>
              </>
            )}
            {focusedPlanet === 'Venus' && (
              <>
                <p>Planeta mais quente do sistema</p>
                <p>Atmosfera densa de CO₂</p>
              </>
            )}
            {focusedPlanet === 'Earth' && (
              <>
                <p>Nosso planeta natal</p>
                <p>Único com vida conhecida</p>
              </>
            )}
            {focusedPlanet === 'Mars' && (
              <>
                <p>Planeta vermelho</p>
                <p>Possíveis habitats futuros</p>
              </>
            )}
            {focusedPlanet === 'Jupiter' && (
              <>
                <p>Maior planeta do sistema</p>
                <p>Gigante gasoso</p>
              </>
            )}
            {focusedPlanet === 'Saturn' && (
              <>
                <p>Famoso por seus anéis</p>
                <p>Menos denso que a água</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Informações do projeto */}
      <div className="absolute bottom-4 right-4 text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm max-w-sm">
        <h3 className="text-lg font-bold mb-2">Space Wars</h3>
        <p className="text-sm">
          NASA Space Apps Challenge 2025<br/>
          Sistema Solar 3D Interativo<br/>
          Pronto para expansão com habitats espaciais
        </p>
      </div>
    </div>
  );
}
