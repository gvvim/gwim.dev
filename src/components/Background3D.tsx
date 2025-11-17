import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Html } from "@react-three/drei";
import Particles from "./Particles";
import Model from "./Model";
// import CanvasCaptureButton from "./CanvasCaptureButton";

const cameraPositions: THREE.Vector3[] = [
  new THREE.Vector3(0, 2.5, 2),
  new THREE.Vector3(2.2, 2, 3),
  new THREE.Vector3(0.5, 1.5, 2.5),
  new THREE.Vector3(0, 1.7, 2.3),
  new THREE.Vector3(-.5, 2, 2.1),
  new THREE.Vector3(-.3, 2.5, .2),
  new THREE.Vector3(0, 1.7, 2.5),
];

const cameraTargets: THREE.Vector3[] = [
  new THREE.Vector3(0, 2.35, 0),
  new THREE.Vector3(-6, 2, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(0.5, 1.8, 2),
  new THREE.Vector3(-2.5, 1.6, -1),
];

const cameraFreelook: number[] = [
  2,
  1.5,
  3,
  3,
  3,
  -.5,
  2,
];

function Camera({ page }: { page: number }) {
  const { camera } = useThree();

  const targetOffset = useRef(new THREE.Vector2(0, 0)); // for mouse movement
  const smooth = useRef(new THREE.Vector2(0, 0));
  const targetPos = useRef(cameraTargets[page].clone());
  const currentPos = useRef(cameraPositions[page].clone());

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.current.set(x * -0.2, y * 0.1);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame(() => {
    const desiredPos = cameraPositions[page] ?? cameraPositions[0];
    const desiredTarget = cameraTargets[page] ?? cameraTargets[0];
    const freelook = cameraFreelook[page] ?? cameraFreelook[0];

    // Lerp mouse movement
    smooth.current.lerp(targetOffset.current, 0.05);
    targetPos.current.lerp(desiredTarget, 0.05);

    // Lerp camera position toward target
    currentPos.current.lerp(desiredPos, 0.05); // 0.05 = smooth speed
    camera.position.copy(currentPos.current);

    // Optional: look at scene center (or adjust per page)
    camera.lookAt(targetPos.current.x - smooth.current.x * freelook, targetPos.current.y - smooth.current.y * freelook, targetPos.current.z);

    (camera as THREE.PerspectiveCamera).fov = page == 5 ? 70 : 45;
    camera.updateProjectionMatrix();
  });

  return null;
}

interface Background3DProps {
    page: number;
  }

export default function Background3D({ page }: Background3DProps) {
    const knightAnims = [
        "holding_sword_loop",
        "arms_crossed_loop",
        "presenting_loop",
        "presenting_loop",
        "presenting_loop",
        "holding_out_hand_loop",
        "kneeling_loop",
    ]

    return <div className="canvas-3d">
        <Canvas gl={{ toneMappingExposure: 1.5, antialias: true, /*preserveDrawingBuffer: true*/ }} dpr={[1, 2]} camera={{near: 0.1, far: 1000, fov: 45, position: [0, 2.5, 2]}}>
          <Suspense
            fallback={
              <Html>
                <img className="fallback-image" src="/fallback/background_capture.webp" />
                <div className="loader-placeholder">
                  <p>Loading scene...</p>
                </div>
              </Html>
            }
          >
            <Camera page={page}/>
            <pointLight 
              color={0xffffff}
              intensity={15}
              distance={10}
              decay={2}
              position={[0.5, 3.3, 1.5]} 
            />
            <pointLight 
              color={0xffffff}
              intensity={12}
              distance={10}
              decay={2}
              position={[-1.5, 3.3, -1.7]} 
            />
            <Environment files="/skybox.hdr" environmentIntensity={0.3}/>
            <Particles count={200} size={.1} boxSize={[7, 4, 7]} speed={.25} scaleVariation={.2}/>
            <Model url="/models/knight.glb" activeAction={knightAnims[page]} />
            {/* <CanvasCaptureButton name="background" /> */}
          </Suspense>
         
        </Canvas>
       
      </div>
}
