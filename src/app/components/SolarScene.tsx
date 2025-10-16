"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Sky,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

interface SolarSceneProps {
  mode: number;
}

/* ----------- Enhanced Solar Panel Component ----------- */
function SolarPanel({
  position,
  rotation,
  sunAngle,
  variant = "standard"
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  sunAngle: number;
  variant?: "standard" | "premium";
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (group.current) {
      // Dynamic tracking with subtle movement
      const tracking = Math.sin(sunAngle) * 0.3;
      group.current.rotation.x = rotation?.[0] || -0.2 - tracking;
      
      // Hover animation
      if (hovered) {
        group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }
  });

  const panelColor = variant === "premium" ? "#0a1f3a" : "#1a1f29";
  const frameColor = variant === "premium" ? "#c0c0c0" : "#aaaaaa";

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main Reflective Surface */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[2.2, 1.3, 32, 32]} />
        <meshPhysicalMaterial
          color={panelColor}
          metalness={0.95}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={hovered ? 2 : 1.2}
        />
      </mesh>

      {/* Solar Cells Pattern */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.0, 1.1, 6, 8]} />
        <meshStandardMaterial 
          color={variant === "premium" ? "#142a4a" : "#151a24"}
          emissive={variant === "premium" ? "#1a3a6a" : "#1a2a4a"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Enhanced Frame */}
      <mesh position={[0, -0.02, -0.05]}>
        <boxGeometry args={[2.25, 0.08, 1.35]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Industrial Support Structure */}
      <group position={[0, -0.6, 0.5]}>
        {[[-0.9, 0, 0], [0.9, 0, 0]].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
              <meshStandardMaterial color="#444" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Cross Braces */}
            <mesh position={[0, 0.3, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ----------- Transmission Tower ----------- */
function TransmissionTower({ position }: { position: [number, number, number] }) {
  const towerRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (towerRef.current) {
      // Subtle sway animation
      towerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={towerRef} position={position}>
      {/* Main Tower Structure */}
      <mesh castShadow position={[0, 8, 0]}>
        <boxGeometry args={[0.3, 16, 0.3]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cross Arms */}
      {[6, 8, 10].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[2.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          
          {/* Insulators */}
          {[-1.2, 1.2].map((x, j) => (
            <group key={j} position={[x, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
                <meshStandardMaterial color="#e8e8e8" metalness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ----------- Energy Storage Unit ----------- */
function BatteryBank({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 2, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status Indicators */}
      <mesh position={[1, 0.8, 0.76]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

/* ----------- Solar Farm Layout ----------- */
function SolarFarm({ mode, sunAngle }: { mode: number; sunAngle: number }) {
  const group = useRef<THREE.Group>(null);
  const [currentMode, setCurrentMode] = useState(mode);

  // Smooth mode transitions
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useFrame((state) => {
    if (group.current) {
      // Dynamic rotation based on mode
      const speed = currentMode === 0 ? 0.05 : currentMode === 1 ? 0.1 : 0.02;
      group.current.rotation.y += speed * 0.01;
      
      // Gentle floating motion
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const tilt = currentMode === 0 ? 0.3 : currentMode === 1 ? 0.6 : 0.1;

  return (
    <group ref={group}>
      {/* Main Solar Array */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <SolarPanel
            key={`${row}-${col}`}
            position={[col * 2.8 - 10, 0, row * 2.5 - 5]}
            rotation={[-tilt, 0, 0]}
            sunAngle={sunAngle}
            variant={col % 3 === 0 ? "premium" : "standard"}
          />
        ))
      )}

      {/* Industrial Infrastructure */}
      <TransmissionTower position={[-15, 0, 0]} />
      <TransmissionTower position={[15, 0, 0]} />
      <BatteryBank position={[12, 1, 8]} />
      <BatteryBank position={[-12, 1, 8]} />

      {/* Control Building */}
      <mesh position={[0, 1.5, 10]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 4]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ----------- Dynamic Sunlight System ----------- */
function Sunlight({ sunAngleRef }: { sunAngleRef: React.MutableRefObject<number> }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunColor = new THREE.Color();

  useFrame((state) => {
    const t = (state.clock.elapsedTime / 25) % 1;
    const sunAngle = t * Math.PI * 2;
    sunAngleRef.current = sunAngle;

    const x = Math.cos(sunAngle) * 20;
    const y = Math.sin(sunAngle) * 12;
    const z = Math.sin(sunAngle) * 8;

    if (light.current) {
      light.current.position.set(x, y, z);

      // Dynamic color transitions
      if (y > 3) {
        sunColor.setHSL(0.12, 0.8, 0.95); // Bright daylight
      } else if (y > 1) {
        sunColor.setHSL(0.1, 0.9, 0.8); // Morning light
      } else if (y > -1) {
        sunColor.setHSL(0.08, 0.85, 0.6); // Golden hour
      } else if (y > -2) {
        sunColor.setHSL(0.05, 0.7, 0.4); // Sunset
      } else {
        sunColor.setHSL(0.6, 0.3, 0.3); // Night/moonlight
      }

      light.current.color = sunColor;
      light.current.intensity = Math.max(0.1, (y + 4) / 8);
    }

    if (ambientRef.current) {
      // Adjust ambient light based on sun position
      ambientRef.current.intensity = Math.max(0.1, (y + 3) / 10);
    }
  });

  return (
    <>
      <directionalLight
        ref={light}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <ambientLight ref={ambientRef} intensity={0.3} />
    </>
  );
}

/* ----------- Fixed Energy Particles Effect ----------- */
function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = Math.random() * 12;
      positions[i + 2] = (Math.random() - 0.5) * 40;
      
      // Solar energy colors (yellow/orange)
      colors[i] = Math.random() * 0.5 + 0.5;     // R
      colors[i + 1] = Math.random() * 0.3 + 0.7; // G
      colors[i + 2] = Math.random() * 0.2;       // B
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      // Gentle floating motion
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ----------- Responsive Camera Controller ----------- */
function CameraController() {
  const { camera, size } = useThree();
  
  useFrame((state) => {
    // Maintain 4:3 aspect ratio awareness
    const aspect = size.width / size.height;
    
    // Dynamic camera movement with different behaviors
    camera.position.x = Math.sin(state.clock.elapsedTime / 12) * 6;
    camera.position.y = 5 + Math.sin(state.clock.elapsedTime / 8) * 1.5;
    camera.position.z = 15 + Math.cos(state.clock.elapsedTime / 15) * 2;
    
    camera.lookAt(0, 2, 0);
  });

  return null;
}

/* ----------- Main Scene Component ----------- */
export default function SolarScene({ mode }: SolarSceneProps) {
  const sunAngleRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client before rendering WebGL content
    setIsClient(true);
  }, []);

  // Don't render on server
  if (!isClient) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: "linear-gradient(180deg, #0a1e3a 0%, #1a3a6a 100%)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading 3D Scene...</div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: "linear-gradient(180deg, #0a1e3a 0%, #1a3a6a 100%)"
    }}>
      <Canvas
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ 
          position: [0, 5, 15], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        gl={{
          antialias: true,
          alpha: true, // Changed to true to fix the context issue
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#0a1e3a']} />
        
        {/* Enhanced Lighting System */}
        <Sunlight sunAngleRef={sunAngleRef} />
        
        {/* Dynamic Environment */}
        <Sky 
          distance={450000}
          sunPosition={[10, 5, 5]}
          turbidity={8}
          rayleigh={6}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* Industrial Solar Farm */}
        <SolarFarm mode={mode} sunAngle={sunAngleRef.current} />

        {/* Energy Effects */}
        <EnergyParticles />

        {/* Enhanced Ground with Reflection */}
        <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100, 20, 20]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={0.5}
            color="#3a5c3a"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Improved Contact Shadows */}
        <ContactShadows 
          position={[0, -0.95, 0]}
          opacity={0.6}
          scale={40}
          blur={2.5}
          far={10}
          resolution={512}
        />

        {/* HDRI Environment */}
        <Environment preset="dawn" />

        {/* Enhanced Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={35}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Advanced Post-Processing */}
        <EffectComposer>
          <Bloom 
            intensity={0.8}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            height={300}
          />
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.02}
            bokehScale={1.5}
            height={300}
          />
        </EffectComposer>

        {/* Camera Controller */}
        <CameraController />
      </Canvas>
    </div>
  );
}