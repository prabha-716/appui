'use client';

import React, { useEffect, useRef } from "react";
import { usePosterStore } from "@/store/usePosterStore";
import "@/app/globals.css";

const MoviePosterScroller = () => {
  const posters = usePosterStore((state) => state.posters);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    let direction = 1;
    const speed = 0.4;

    const scroll = () => {
      if (!container) return;

      container.scrollLeft += speed * direction;

      if (
        container.scrollLeft + container.clientWidth >= container.scrollWidth ||
        container.scrollLeft <= 0
      ) {
        direction *= -1; // reverse direction
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="py-4 px-2">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto whitespace-nowrap scroll-hide"
      >
        {posters.map((poster, index) => (
          <img
            key={index}
            src={poster}
            alt={`Movie poster ${index + 1}`}
            className="h-64 w-auto shadow-lg flex-shrink-0 transition-transform duration-300 hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default MoviePosterScroller;
