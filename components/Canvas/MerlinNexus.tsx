"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// A floating orb representing "Merlin" / The Engine Sphere
const MerlinOrb = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            if (hovered) {
                meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere 
                ref={meshRef} 
                args={[1, 64, 64]} 
                onPointerOver={() => setHover(true)} 
                onPointerOut={() => setHover(false)}
            >
                <MeshDistortMaterial 
                    color={hovered ? "#a855f7" : "#00f0ff"} 
                    attach="material" 
                    distort={0.4} 
                    speed={2} 
                    roughness={0} 
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

// Particles surrounding the orb
const ParticleRing = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= 0.002;
            groupRef.current.rotation.z += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            {[...Array(50)].map((_, i) => (
                <mesh key={i} position={[
                    (Math.random() - 0.5) * 5, 
                    (Math.random() - 0.5) * 5, 
                    (Math.random() - 0.5) * 5
                ]}>
                    <sphereGeometry args={[0.02, 16, 16]} />
                    <meshStandardMaterial color="#ffffff" emissive="#a855f7" emissiveIntensity={2} />
                </mesh>
            ))}
        </group>
    );
};

export function MerlinNexus() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-black/40 rounded-xl border border-white/10 font-mono text-neon-purple animate-pulse">
                INITIALIZING_MERLIN_CORE...
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
            <div className="absolute top-4 left-4 z-10 font-mono text-xs text-neon-purple bg-black/50 px-3 py-1 rounded border border-neon-purple/30 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.2)] flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
                    MERLIN_OROBOROS_LINK_ACTIVE
                </div>
                <span className="text-gray-400 text-[10px]">Interact with the sphere to stimulate agents</span>
            </div>
            
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <spotLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />
                <MerlinOrb />
                <ParticleRing />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
