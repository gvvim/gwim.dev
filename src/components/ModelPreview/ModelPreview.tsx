import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef } from "react";
import "./ModelPreview.css";

import sketchfabIcon from '../../assets/icons/sketchfab.svg'
// import CanvasCaptureButton from "../CanvasCaptureButton";

interface ModelPreviewProps {
    url: string;
    fallbackUrl: string;
    sketchfabUrl?: string;
    use3D?: boolean;
    useAlpha?: boolean;
}

// let modelCounter = 0;

export default function ModelPreview({ url, sketchfabUrl, fallbackUrl, use3D = false, useAlpha = false }: ModelPreviewProps) {
  // const indexRef = useRef(modelCounter++);
  // const index = indexRef.current / 2;

  return (
    <div className="model-preview">
      {use3D &&
      <Canvas
        gl={{ alpha: true, /*preserveDrawingBuffer: true*/ }}
        camera={{ fov: 45, near: 0.1, far: 5000 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene url={url} enableTransparency={useAlpha} fallbackUrl={fallbackUrl}/>
        {/* <CanvasCaptureButton name={`model_${index}`} /> */}
      </Canvas>}
      {!use3D && <div className="fallback-model" style={{backgroundImage: `url(${fallbackUrl})`}}>3D Viewer Not Supported</div>}
      <div className="model-links">
          {sketchfabUrl && <a href={sketchfabUrl} target="_blank" className="model-link">
              <div className="link-popup">Sketchfab</div>
              <img src={sketchfabIcon} />
          </a>}
          
      </div>
    </div>
  );
}

function Scene({ url,  fallbackUrl, enableTransparency }: { url: string; fallbackUrl: string; enableTransparency: boolean; }) {
  const { scene } = useGLTF(url, true);
  const { camera, size } = useThree();
  const model = useMemo(() => scene.clone(true), [scene]);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(model);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    const { center, radius } = sphere;

    // camera framing
    
    //@ts-ignore // Camera is always PerspectiveCamera but I don't want to import and cast it just for the error
    const fov = (camera.fov * Math.PI) / 180;
    
    const aspect = size.width / size.height;

    const distV = radius / Math.sin(fov / 2);
    const distH = radius / Math.sin(Math.atan(Math.tan(fov / 2) * aspect));

    let distance = Math.max(distV, distH);

    distance *= 0.9; // tweak for closer framing

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    // OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }

    if (enableTransparency) {
      model.traverse((obj) => {
        if ((obj as any).isMesh) {
          const mesh = obj as THREE.Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            const m = mat as THREE.Material & { transparent?: boolean; alphaTest?: number };
            m.transparent = false;
            m.alphaTest = 0.5;
            m.depthWrite = true;
          });
        }
      });
    }

  }, [model, camera, size, enableTransparency]);

  return (
    <>
      <Suspense fallback={
          <Html>
            <img className="fallback-image" src={fallbackUrl} />
            <div className="loader-placeholder">
              <p>Loading scene...</p>
            </div>
          </Html>
        }
      >
        <ambientLight intensity={1.2} />
        <directionalLight intensity={7} position={[5, 8, 5]} />
        <directionalLight intensity={0.7} position={[-5, 8, -5]} />

        <primitive object={model} />

        <OrbitControls ref={controlsRef} enablePan={false} autoRotate />
      </Suspense>
    </>
  );
}
