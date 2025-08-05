"use client";

import React, { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import "@/app/globals.css";

interface Movie {
  title: string;
  year: number;
  rating: number;
  poster: string;
}

interface MovieRowProps {
  movies: Movie[];
  loadMoreMovies: () => void; 
}

const MovieRow: React.FC<MovieRowProps> = ({ movies, loadMoreMovies }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

      const handleScroll = () => {
        if (
          container.scrollLeft + container.clientWidth >= container.scrollWidth - 100
        ) {
          loadMoreMovies(); 
        }
        else{
          
        }
      };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMoreMovies]);

  return (
    <div className="max-w-full h-auto px-1.5 py-1.5 rounded-sm bg-transparent">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide"
      >
        <div className="flex gap-10">
          {movies.map((movie, index) => (
            <div key={index} className="inline-block w-[10rem] flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
