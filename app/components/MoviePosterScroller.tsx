'use client';

import React, { useEffect, useRef } from "react";
import { usePosterStore } from "@/store/usePosterStore";
import "@/app/globals.css";

const MoviePosterScroller = () => {
  const posters = usePosterStore((state) => state.posters);
  
  return (
    <div className="py-0 px-0">
      <div
        className="flex gap-4 overflow-x-auto whitespace-nowrap scroll-hide cursor-pointer rounded-lg">
        {posters.map((poster, index) => (
          <img
            key={index}
            src={poster}
            alt={`Movie poster ${index + 1}`}
            className="h-69 w-auto shadow-lg flex-shrink-0 rounded-lg transform transition-all duration-100 hover:scale-102 active:scale-95] "
          />
        ))}
      </div>
    </div>
  );
};

export default MoviePosterScroller;
