import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

function saveCanvasImage(canvas: HTMLCanvasElement, filename = "canvas.jpg", quality = 0.9) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/webp", quality);
    link.click();
}

interface CanvasCaptureButtonProps {
    name: string;
}

export default function CanvasCaptureButton({ name = "scene" } : CanvasCaptureButtonProps) {
  const { gl } = useThree();

  const capture = () => saveCanvasImage(gl.domElement, `${name}_capture.webp`);

  useEffect(() => {
    //Shift P to capture previews of all canvases, utility for creating fallback images
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "P") capture();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [capture]);

  return (
    <Html position={[0, 3, 0]}>
    <button className="canvas-capture-btn" onClick={capture}>
      Save as Image
    </button>
    </Html>
  );
}