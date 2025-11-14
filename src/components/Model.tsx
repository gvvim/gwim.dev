import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

interface ModelProps {
  url: string;
  activeAction?: string;
}

type GLTFWithAnimations = GLTF & {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export default function Model({ url, activeAction }: ModelProps) {
  const group = useRef<Group>(null!);
  const { scene, animations } = useGLTF(url, true) as unknown as GLTFWithAnimations;
  const { actions, mixer } = useAnimations(animations, group);

  scene.visible = false;

  const swordRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
  
    const nextAction = activeAction ? actions[activeAction] : Object.values(actions)[0];
    if (!nextAction) return;
  
    const currentAction = Object.values(actions).find(a => a?.isRunning());
  
    if (currentAction && currentAction !== nextAction) {
      // Smoothly fade out previous
      currentAction.fadeOut(0.35);
    }
  
    // Ensure next action starts from beginning or current time
    nextAction
      .reset()
      .fadeIn(0.35)
      .play();

    mixer?.update(0);

    if (!swordRef.current) return;

    const swordVisibleAnims = ["holding_sword_loop", "kneeling_loop"];

    if (activeAction && swordVisibleAnims.includes(activeAction)) {
        swordRef.current.visible = true;
    } else {
        swordRef.current.visible = false;
    }
    scene.visible = true;
  }, [activeAction, actions]);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        // For textures with alpha
        material.transparent = false;
        material.alphaTest = 0.5;
        material.depthWrite = true;
    }

    if ((child as THREE.Mesh).name === "Sword") {
        swordRef.current = child as THREE.Mesh;
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}
