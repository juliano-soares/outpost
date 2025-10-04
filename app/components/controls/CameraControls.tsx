'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControlsProps {
  target?: [number, number, number];
  distance?: number;
  minDistance?: number;
  maxDistance?: number;
  focusTarget?: [number, number, number] | null;
  onFocusComplete?: () => void;
}

export default function CameraControls({ 
  target = [0, 0, 0], 
  distance = 8,
  minDistance = 1,
  maxDistance = 30,
  focusTarget = null, 
  onFocusComplete
}: CameraControlsProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef({
    target: new THREE.Vector3(...target),
    isMouseDown: false,
    isRightMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    rotationX: 0,
    rotationY: 0,
    distance: distance,
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
      forward: false,
      backward: false,
      zoomIn: false,
      zoomOut: false
    }
  });

  // Inicializar posição da câmera
  useEffect(() => {
    const target = controlsRef.current.target;
    const position = new THREE.Vector3(0, 0, distance);
    position.add(target);
    
    camera.position.copy(position);
    camera.lookAt(target);
  }, [camera, distance, target]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (focusTarget) return; // Não permitir zoom durante foco
      
      const zoomSpeed = 0.1;
      controlsRef.current.distance += event.deltaY * zoomSpeed * 0.01;
      controlsRef.current.distance = Math.max(minDistance, Math.min(maxDistance, controlsRef.current.distance));
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (focusTarget) return; // Não permitir controles de mouse durante foco
      
      if (event.button === 0) { // Botão esquerdo
        controlsRef.current.isMouseDown = true;
        controlsRef.current.mouseX = event.clientX;
        controlsRef.current.mouseY = event.clientY;
        controlsRef.current.lastMouseX = event.clientX;
        controlsRef.current.lastMouseY = event.clientY;
      } else if (event.button === 2) { // Botão direito
        controlsRef.current.isRightMouseDown = true;
        controlsRef.current.mouseX = event.clientX;
        controlsRef.current.mouseY = event.clientY;
        controlsRef.current.lastMouseX = event.clientX;
        controlsRef.current.lastMouseY = event.clientY;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        controlsRef.current.isMouseDown = false;
      } else if (event.button === 2) {
        controlsRef.current.isRightMouseDown = false;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (focusTarget) return; // Não permitir controles de mouse durante foco
      
      const controls = controlsRef.current;
      
      if (controls.isMouseDown) {
        // Rotação com botão esquerdo
        const deltaX = event.clientX - controls.lastMouseX;
        const deltaY = event.clientY - controls.lastMouseY;
        
        controls.rotationY -= deltaX * 0.01;
        controls.rotationX += deltaY * 0.01;
        controls.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, controls.rotationX));
        
        controls.lastMouseX = event.clientX;
        controls.lastMouseY = event.clientY;
      } else if (controls.isRightMouseDown) {
        // Pan com botão direito
        const deltaX = event.clientX - controls.lastMouseX;
        const deltaY = event.clientY - controls.lastMouseY;
        
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);
        
        camera.getWorldDirection(forward);
        right.crossVectors(forward, up).normalize();
        
        const panSpeed = 0.01;
        camera.position.add(right.clone().multiplyScalar(-deltaX * panSpeed));
        camera.position.add(up.clone().multiplyScalar(deltaY * panSpeed));
        
        controls.lastMouseX = event.clientX;
        controls.lastMouseY = event.clientY;
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault(); // Prevenir menu de contexto
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          controlsRef.current.keys.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controlsRef.current.keys.backward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controlsRef.current.keys.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controlsRef.current.keys.right = true;
          break;
        case 'KeyQ':
          controlsRef.current.keys.up = true;
          break;
        case 'KeyE':
          controlsRef.current.keys.down = true;
          break;
        case 'KeyZ':
          controlsRef.current.keys.zoomIn = true;
          break;
        case 'KeyX':
          controlsRef.current.keys.zoomOut = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          controlsRef.current.keys.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          controlsRef.current.keys.backward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          controlsRef.current.keys.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          controlsRef.current.keys.right = false;
          break;
        case 'KeyQ':
          controlsRef.current.keys.up = false;
          break;
        case 'KeyE':
          controlsRef.current.keys.down = false;
          break;
        case 'KeyZ':
          controlsRef.current.keys.zoomIn = false;
          break;
        case 'KeyX':
          controlsRef.current.keys.zoomOut = false;
          break;
      }
    };

    gl.domElement.addEventListener('wheel', handleWheel);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gl.domElement, minDistance, maxDistance, focusTarget]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    const speed = 0.05;

    // Se há um foco ativo, mover suavemente para o alvo
    if (focusTarget) {
      const targetVector = new THREE.Vector3(...focusTarget);
      const currentPosition = camera.position.clone();
      const direction = targetVector.clone().sub(currentPosition);
      const distance = direction.length();
      
      if (distance > 0.5) {
        // Mover suavemente em direção ao alvo com uma distância de parada
        const moveSpeed = Math.min(distance * 0.05, 0.2);
        direction.normalize().multiplyScalar(moveSpeed);
        camera.position.add(direction);
        
        // Olhar para o alvo
        camera.lookAt(targetVector);
        controls.target.copy(targetVector);
      } else {
        // Foco completo - posicionar a câmera a uma distância fixa do planeta
        const finalPosition = targetVector.clone().add(new THREE.Vector3(0, 0, 0.8));
        camera.position.copy(finalPosition);
        camera.lookAt(targetVector);
        controls.target.copy(targetVector);
        
        // Foco completo
        if (onFocusComplete) {
          onFocusComplete();
        }
      }
      return;
    }

    // Aplicar rotação baseada no mouse
    const target = controls.target;
    const distance = controls.distance;
    
    // Calcular posição da câmera baseada na rotação
    const x = Math.sin(controls.rotationY) * Math.cos(controls.rotationX) * distance;
    const y = Math.sin(controls.rotationX) * distance;
    const z = Math.cos(controls.rotationY) * Math.cos(controls.rotationX) * distance;
    
    const position = new THREE.Vector3(x, y, z).add(target);
    camera.position.copy(position);
    camera.lookAt(target);

    // Calcular direções baseadas na orientação atual da câmera
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    camera.getWorldDirection(forward);
    right.crossVectors(forward, up).normalize();

    // Movimento livre no espaço 3D
    if (controls.keys.forward) {
      camera.position.add(forward.clone().multiplyScalar(speed));
      controls.target.add(forward.clone().multiplyScalar(speed));
    }
    if (controls.keys.backward) {
      camera.position.add(forward.clone().multiplyScalar(-speed));
      controls.target.add(forward.clone().multiplyScalar(-speed));
    }
    
    // A e D movem horizontalmente (esquerda/direita)
    if (controls.keys.left) {
      camera.position.add(right.clone().multiplyScalar(-speed));
      controls.target.add(right.clone().multiplyScalar(-speed));
    }
    if (controls.keys.right) {
      camera.position.add(right.clone().multiplyScalar(speed));
      controls.target.add(right.clone().multiplyScalar(speed));
    }
    
    // Q e E movem verticalmente (cima/baixo)
    if (controls.keys.up) {
      camera.position.add(up.clone().multiplyScalar(speed));
      controls.target.add(up.clone().multiplyScalar(speed));
    }
    if (controls.keys.down) {
      camera.position.add(up.clone().multiplyScalar(-speed));
      controls.target.add(up.clone().multiplyScalar(-speed));
    }

    // Zoom com Z/X
    if (controls.keys.zoomIn) {
      camera.position.add(forward.clone().multiplyScalar(speed * 2));
    }
    if (controls.keys.zoomOut) {
      camera.position.add(forward.clone().multiplyScalar(-speed * 2));
    }
  });

  return null;
}