"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { extend, Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, PerspectiveCamera, Float, shaderMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Custom Shader for cinematic Solar Corona / Plasma Waves
 */
const SunCoronaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#ff4500"),
  },
  // Vertex Shader - Handles vertex displacement for "real" physical waves
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;

    // Simplex 3D Noise for displacement
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate physical waves/displacement
      float strength = 0.15;
      float displacement = snoise(vec3(position.xyz * 1.5 + uTime * 0.5)) * strength;
      vec3 newPosition = position + normal * displacement;
      
      vPosition = newPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader - Handles plasma color and glow
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0; 
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Fresnel effect for the cinematic outer glow
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      
      // Moving waves using multi-layered Simplex noise
      float noise = snoise(vec3(vPosition.xyz * 1.2 + uTime * 0.4));
      noise += snoise(vec3(vPosition.xyz * 2.5 + uTime * 0.2)) * 0.5;
      
      // Map noise to opacity and color intensity
      float wave = smoothstep(-0.2, 0.8, noise);
      float alpha = fresnel * (0.1 + wave * 0.5);
      
      // Dynamic Star Color (Mixing deep orange and burning white)
      extend({ SunCoronaMaterial });

      declare global {
        namespace JSX {
          interface IntrinsicElements {
            sunCoronaMaterial: any;
          }
        }
      }
      vec3 starColor = mix(uColor, vec3(1.0, 0.9, 0.2), wave);
      
      gl_FragColor = vec4(starColor, alpha);
    }
  `
);

extend({ SunCoronaMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sunCoronaMaterial: any;
    }
  }
}

function Globe({ theme }: { theme: string | undefined }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/mars.jpg");

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  const isTerminal = theme === 'terminal';
  const isLight = theme === 'light';

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      {isTerminal ? (
        <meshStandardMaterial
          wireframe
          transparent
          opacity={0.4}
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={0.5}
        />
      ) : (
        <meshStandardMaterial
          map={texture}
          roughness={isLight ? 0.9 : 0.8}
          metalness={isLight ? 0.1 : 0.2}
          bumpScale={0.05}
          emissive={isLight ? "#201005" : "#000000"}
          emissiveIntensity={isLight ? 0.2 : 0}
        />
      )}
    </mesh>
  );
}

function RealisticSun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/sun.jpg");

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
      sunRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.005);
    }
    if (coronaRef.current) {
      // @ts-ignore
      coronaRef.current.material.uTime = time;
    }
  });

  return (
    <group position={[8, 4, -15]}>
      {/* Textured Sun Core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      {/* Photosphere Glow */}
      <Sphere args={[1.25, 64, 64]}>
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.3} />
      </Sphere>

      {/* Advanced Corona / Plasma Waves */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.3, 128, 128]} />
        <sunCoronaMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Primary Light Source */}
      <pointLight intensity={1000} color="#fff4e0" distance={200} decay={2} castShadow />

      {/* Secondary Flare */}
      <pointLight position={[-1, -1, 0]} intensity={200} color="#ff8c00" distance={100} decay={2} />
    </group>
  );
}

export default function MarsGlobe() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isTerminal = theme === 'terminal';
  const isLight = theme === 'light';

  return (
    <div className={cn(
      "fixed inset-0 z-[-10] transition-colors duration-1000",
      isTerminal ? "bg-black" : "bg-[#020204]"
    )}>
      {isLight && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,#fff4e010_0%,transparent_60%)] pointer-events-none" />
      )}

      {isTerminal && (
        <div className="absolute inset-0 z-50 pointer-events-none opacity-20 overflow-hidden">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanline" />
        </div>
      )}

      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ReinhardToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />

          <ambientLight intensity={isTerminal ? 1 : 0.05} color={isTerminal ? "#00ff41" : "#ffffff"} />

          {isLight && <RealisticSun />}

          {isTerminal && (
            <gridHelper args={[10, 20, "#00ff41", "#022c0b"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]} />
          )}

          <Globe theme={theme} />

          {!isTerminal && (
            <Stars
              radius={200}
              depth={100}
              count={isLight ? 2000 : 5000}
              factor={4}
              saturation={0}
              fade
              speed={0.5}
            />
          )}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-1000",
        isTerminal
          ? "bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]"
          : "bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-20"
      )} />

      {!isTerminal && (
        <div className={cn(
          "absolute inset-0 pointer-events-none mix-blend-screen transition-colors duration-2000",
          isLight ? "bg-amber-100/5" : "bg-primary/2"
        )} />
      )}
    </div>
  );
}
