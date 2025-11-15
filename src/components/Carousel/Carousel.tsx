import React, { useEffect, useRef } from "react";
import "./Carousel.css";

interface CarouselProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
  onInit?: (slideCount: number) => void;
  children: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({
  currentIndex,
  onIndexChange,
  autoPlay = false,
  interval = 3000,
  onInit,
  children,
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideCount = children.length;
  const visibleSlides = 3;
  const slideWidthPercent = 100 / visibleSlides;

  // Notify parent about slide count
  useEffect(() => {
    onInit?.(slideCount);
  }, [slideCount, onInit]);

  useEffect(() => {
    if (!autoPlay || slideCount <= 1) return;

    timeoutRef.current = setTimeout(() => {
      onIndexChange(currentIndex < slideCount - 1 ? currentIndex + 1 : currentIndex);
    }, interval);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [autoPlay, interval, currentIndex, slideCount, onIndexChange]);

  // Add fake slides to left and right for centering
  const extendedSlides = [null, ...children, null];

  const targetOffset = currentIndex * slideWidthPercent;

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{
          display: "flex",
          transform: `translateX(-${targetOffset}%)`,
          transition: "transform 0.5s ease",
        }}
      >
        {extendedSlides.map((child, index) => {
          if (child === null) {
            return (
              <div
                key={index}
                className="carousel-slide empty"
                style={{ flex: `0 0 ${slideWidthPercent}%` }}
              />
            );
          }

          const actualIndex = index - 1; // adjust for left placeholder
          let className = "carousel-slide-inner hidden";
          if (actualIndex === currentIndex) className = "carousel-slide-inner active";
          else if (actualIndex === currentIndex - 1) className = "carousel-slide-inner prev";
          else if (actualIndex === currentIndex + 1) className = "carousel-slide-inner next";

          return (
            <div
              key={index}
              className="carousel-slide"
              style={{ flex: `0 0 ${slideWidthPercent}%` }}
            >
              <div
                className={className}
                onClick={() => {
                  if (actualIndex === currentIndex - 1 || actualIndex === currentIndex + 1) {
                    onIndexChange(actualIndex);
                  }
                }}
                style={{
                  cursor:
                    actualIndex === currentIndex - 1 || actualIndex === currentIndex + 1
                      ? "pointer"
                      : "default",
                }}
              >
                {child}
              </div>
            </div>
          );
        })}
      </div>

      <div className="carousel-nav">
        {children.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => onIndexChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
