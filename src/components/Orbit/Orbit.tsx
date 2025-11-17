import React, { useEffect, useRef } from "react";

interface OrbitProps {
  radius?: number;       // horizontal radius
  duration?: number;     // seconds per full orbit
  squash?: number;       // vertical scale (0 < squash <= 1)
  depthScale?: number;   // 0 < depthScale <= 1, scale variation for perspective
  children: React.ReactNode[];
}

const Orbit: React.FC<OrbitProps> = ({
  radius = 100,
  duration = 5,
  squash = 0.6,
  depthScale = 0.5,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = performance.now();
    const total = children.length;
    const animate = (time: number) => {
      if (!containerRef.current) return;
      const elapsed = (time - start) / 1000; // seconds
      const angle = (elapsed / duration) * 2 * Math.PI;

      Array.from(containerRef.current.children).forEach((child, i) => {
        const theta = (2 * Math.PI * i) / total + angle;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta) * squash;
        // optional depth scaling
        const scale = 1 - (1 - depthScale) * (0.5 - 0.5 * Math.sin(theta));

        (child as HTMLElement).style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [radius, duration, squash, depthScale, children.length]);

  return (
    <div style={{ height: 500, display: "flex" , alignItems: "center"}}>
    <div
      ref={containerRef}
      style={{ position: "relative", width: 0, height: 0 }}
    >
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translate(0,0)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
    </div>
  );
};

export default Orbit;