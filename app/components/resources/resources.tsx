'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface ResourcesProps {
  water: number;
  food: number;
  oxygen: number;
  minerals: {
    iron: number;
    copper: number;
    gold: number;
    silver: number;
    platinum: number;
    uranium: number;
    thorium: number;
  };
  energy: {
    solar: number;
    nuclear: number;
    fuel: number;
  };
  population: {
    pilots: number;
    engineers: number;
    scientists: number;
    medics: number;
    technicians: number;
    civilians: number;
  };
  technology: {
    ships: number;
    modules: number;
    weapons: number;
    shields: number;
    engines: number;
  };
  science: {
    biology: number;
    physics: number;
    chemistry: number;
    geology: number;
    astronomy: number;
  };
  diplomacy: number;
  exploration: {
    planets: number;
    stars: number;
    galaxies: number;
    universe: number;
  };
  economy: {
    money: number;
  };
}

export default function Resources({  }: ResourcesProps) {

  return (
    <div>
      <h1>Resources</h1>

    </div>
  );
}
