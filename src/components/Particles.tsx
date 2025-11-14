import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  boxSize?: [number, number, number];
  speed?: number;
  size?: number;
  color?: number;
  scaleVariation?: number;
}

export default function Particles({
  count = 200,
  boxSize = [2, 2, 2],
  speed = 0.5,
  size = 0.08,
  color = 0xff6600,
  scaleVariation = 0.5,
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * boxSize[0];
      arr[i * 3 + 1] = Math.random() * boxSize[1];
      arr[i * 3 + 2] = (Math.random() - 0.5) * boxSize[2];
    }
    return arr;
  }, [count, boxSize]);

  const life = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random();
    return arr;
  }, [count]);

  const phase = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random() * Math.PI * 2;
    return arr;
  }, [count]);

  const velocity = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 0.1,
        speed,
        (Math.random() - 0.5) * 0.1,
      ]);
    }
    return arr;
  }, [count, speed]);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,200,100,0.8)");
    gradient.addColorStop(1, "rgba(255,100,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3 + 0] = (color >> 16 & 255) / 255;
      colors[i * 3 + 1] = (color >> 8 & 255) / 255;
      colors[i * 3 + 2] = (color & 255) / 255;
    }
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [positions, count, color]);

  const baseSize = size;

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colors = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
  
    for (let i = 0; i < count; i++) {
      // random jitter
      pos.array[i * 3 + 0] += (velocity[i][0] + (Math.random()-0.5)*0.002) * delta;
      pos.array[i * 3 + 1] += (velocity[i][1] + (Math.random()-0.5)*0.002) * delta;
      pos.array[i * 3 + 2] += (velocity[i][2] + (Math.random()-0.5)*0.002) * delta;
  
      life[i] += delta * 0.5;
  
      // Pulsate independently per particle
      const alpha = Math.sin(life[i] * Math.PI + phase[i]) * 0.35 + 0.65;
  
      // Reset if out of bounds
      if (pos.array[i * 3 + 1] > boxSize[1]) {
        pos.array[i * 3 + 1] = Math.random() * boxSize[1]; // small random offset at respawn
        pos.array[i * 3 + 0] = (Math.random() - 0.5) * boxSize[0];
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * boxSize[2];
        life[i] = 0;
        phase[i] = Math.random() * Math.PI * 2;
      }
  
      // Update color with alpha
      colors.setXYZ(
        i,
        ((color >> 16) & 255) / 255 * alpha,
        ((color >> 8) & 255) / 255 * alpha,
        (color & 255) / 255 * alpha
      );
    }
  
    pos.needsUpdate = true;
    colors.needsUpdate = true;
  
    // Scale pulsation
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      const mat = pointsRef.current.material;
      mat.size = baseSize * (1 + Math.sin(performance.now() * 0.002) * scaleVariation);
    }
  });  

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        map={texture}
        vertexColors
        size={baseSize}
        sizeAttenuation
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
