import { useEffect, useState } from "react";
import "./Quote.css";

export default function Quote() {
  const quotes = [
    "Te spectare coegi.",
    "You only live once, but if you do it right, once is enough.",
    "Attacking an enemy's weakpoint deals extra damage.",
  ];

  const [currentIndex, setIndex] = useState(0);
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // trigger dissolve

      // after fade out, switch quote and fade back in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 2000);
    }, 15000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <p className={`quote ${isVisible ? "visible" : "hidden"}`}>
      {quotes[currentIndex]}
    </p>
  );
}
