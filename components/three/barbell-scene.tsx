"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PlateModel } from "@/components/three/plate-model";

function Barbell() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42) * 0.025;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.015;
  });

  return (
    <group ref={group} position={[-0.8, -0.02, 0]} rotation={[0.04, 0.28, -0.07]} scale={0.84}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.09, 10, 32]} />
        <meshStandardMaterial color="#9A9A9D" roughness={0.26} metalness={0.88} />
      </mesh>
      <mesh position={[-2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.25, 32]} />
        <meshStandardMaterial color="#B8B5AE" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.25, 32]} />
        <meshStandardMaterial color="#B8B5AE" roughness={0.25} metalness={0.9} />
      </mesh>
      <PlateModel x={-2.05} side="left" radius={1.45} depth={0.38} delay={0.1} />
      <PlateModel x={2.05} side="right" radius={1.45} depth={0.38} delay={0.18} />
      <PlateModel x={-2.48} side="left" radius={1.24} depth={0.34} color="#2A2A2D" delay={0.34} />
      <PlateModel x={2.48} side="right" radius={1.24} depth={0.34} color="#2A2A2D" delay={0.42} />
      <PlateModel x={-2.86} side="left" radius={0.98} depth={0.28} color="#1D1D20" delay={0.56} />
      <PlateModel x={2.86} side="right" radius={0.98} depth={0.28} color="#1D1D20" delay={0.64} />
    </group>
  );
}

function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        if (object.geometry instanceof THREE.TorusGeometry && object.material instanceof THREE.MeshStandardMaterial) {
          object.material.color.set("#FF4D1C");
          object.material.emissive.set("#FF4D1C");
          object.material.emissiveIntensity = 0.9;
          object.material.toneMapped = false;
        }
      }
    });
  }, [scene]);

  return null;
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[-3, 5, 6]}
        intensity={4.8}
        color="#FFF4E8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[4.5, 0.5, 3]} intensity={42} color="#FF4D1C" distance={11} decay={2} />
      <pointLight position={[-2.5, -1, 4]} intensity={5} color="#6F8296" distance={9} decay={2} />
    </>
  );
}

export default function BarbellScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0.85, 0.25, 8.8], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <SceneSetup />
      <SceneLighting />
      <Barbell />
    </Canvas>
  );
}
