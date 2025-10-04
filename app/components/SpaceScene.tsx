'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import CameraControls from './controls/CameraControls';
import InstructionControls from './controls/InstructionControls';
import Planet from './planets/Planet';
import planetsData from './planets/Planets.json';

export default function SpaceScene() {
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);

  const handlePlanetClick = (planetName: string) => {
    setFocusedPlanet(planetName);
    
    // Buscar posição do planeta no JSON
    const planet = planetsData.find(p => p.name === planetName);
    if (planet) {
      setFocusTarget(planet.position as [number, number, number]);
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
          position: [2.4, 0, 2], 
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

        {/* Planetas carregados do JSON */}
        {planetsData.map((planet) => (
          <Planet
            key={planet.name}
            name={planet.name}
            position={planet.position as [number, number, number]}
            radius={planet.radius}
            color={planet.color}
            rotationSpeed={planet.rotationSpeed}
            orbitSpeed={planet.orbitSpeed}
            orbitRadius={planet.orbitRadius}
            onPlanetClick={handlePlanetClick}
            showLabel={planet.showLabel}
          />
        ))}

        {/* Indicador de posição da câmera (temporário para debug) */}
        <mesh position={[2.4, 0, 2]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {/* Controles unificados (mouse, teclado e foco) */}
        <CameraControls 
          target={[2.4, 0, 0]}
          distance={2}
          minDistance={0.5}
          maxDistance={15}
          focusTarget={focusTarget}
          onFocusComplete={handleFocusComplete}
        />
      </Canvas>
      
      {/* Instruções de controle */}
      <InstructionControls />
      {/* Informações do planeta focado */}
      {focusedPlanet && (
        <div className="absolute top-4 right-4 text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">
              🌍 {(() => {
                const planet = planetsData.find(p => p.name === focusedPlanet);
                return planet?.information?.name || focusedPlanet;
              })()}
            </h3>
            <button 
              onClick={handleExitFocus}
              className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            >
              ✕ Sair
            </button>
          </div>
          <div className="text-sm space-y-1">
            {(() => {
              const planet = planetsData.find(p => p.name === focusedPlanet);
              if (planet && planet.information) {
                return (
                  <>
                    <p>{planet.information.description}</p>
                    <p>Temperatura: {planet.information.temperature}</p>
                    <p>Atmosfera: {planet.information.atmosphere}</p>
                  </>
                );
              }
              return <p>Informações não disponíveis</p>;
            })()}
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
