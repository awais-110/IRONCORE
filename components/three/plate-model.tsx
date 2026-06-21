"use client";

import { useLayoutEffect, useRef } from "react";
import { Group } from "three";
import gsap from "gsap";

export function PlateModel({
  x,
  side,
  radius,
  depth,
  color = "#202023",
  delay
}: {
  x: number;
  side: "left" | "right";
  radius: number;
  depth: number;
  color?: string;
  delay: number;
}) {
  const ref = useRef<Group>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const start = side === "left" ? x - 6 : x + 6;
    gsap.fromTo(
      ref.current.position,
      { x: start },
      { x, duration: 1, delay, ease: "power3.out" }
    );
    gsap.fromTo(
      ref.current.rotation,
      { z: Math.PI / 2 + (side === "left" ? -0.45 : 0.45) },
      { z: Math.PI / 2, duration: 1.15, delay, ease: "elastic.out(1, 0.45)" }
    );
  }, [delay, side, x]);

  return (
    <group ref={ref} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, depth, 48]} />
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.62} />
      </mesh>
      <mesh position={[0, depth / 2 + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.72, 0.035, 12, 48]} />
        <meshStandardMaterial color="#FF4D1C" roughness={0.5} metalness={0.45} />
      </mesh>
    </group>
  );
}
