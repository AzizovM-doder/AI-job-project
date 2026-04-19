"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/mars.jpg");

  // slow auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.8}
        metalness={0.2}
        bumpScale={0.05}
      />
    </mesh>
  );
}

export default function MarsGlobe() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[-10] bg-black">
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 3]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight 
             position={[5, 3, 5]} 
             intensity={3} 
             color="#ffdfd0" 
             castShadow
          />
          <pointLight position={[-5, -3, -5]} intensity={0.5} color="#402010" />

          <Globe />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false} 
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-color" />
    </div>
  );
}
