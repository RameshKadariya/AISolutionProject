import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './Scene3D.css';

// Animated cube component with AI-related textures
function AICube(props) {
  const mesh = useRef();
  
  // Rotate the cube on each frame
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={1.5}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff9900" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Floating particles representing data or AI concepts
function Particles({ count = 1000 }) {
  const mesh = useRef();
  
  // Create particles in a spherical distribution
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Position in a sphere
    const radius = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Orange color with variations
    colors[i * 3] = 1.0;  // R (full)
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;  // G (orange-ish)
    colors[i * 3 + 2] = 0;  // B (none)
  }
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Floating text that represents AI-Solution's core values
function FloatingText({ position, text, size = 0.2 }) {
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y += Math.sin(clock.getElapsedTime()) * 0.002;
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={size}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

// Main 3D Scene component
const Scene3D = () => {
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Main AI Cube */}
        <AICube position={[0, 0, 0]} />
        
        {/* Particle system */}
        <Particles count={1000} />
        
        {/* Floating text elements */}
        <FloatingText position={[-3, 2, 0]} text="Innovate" size={0.5} />
        <FloatingText position={[0, 2.5, 0]} text="Promote" size={0.5} />
        <FloatingText position={[3, 2, 0]} text="Deliver" size={0.5} />
        
        <FloatingText position={[-2.5, -2, 1]} text="AI" size={0.3} />
        <FloatingText position={[-1.5, -2.5, 0.5]} text="Solutions" size={0.3} />
        <FloatingText position={[1.5, -2, 0]} text="Digital" size={0.3} />
        <FloatingText position={[2.5, -2.5, 0.5]} text="Experience" size={0.3} />
        
        {/* Controls to allow user interaction */}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Scene3D;