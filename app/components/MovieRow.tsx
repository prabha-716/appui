"use client";

import React from "react";
import MovieCard from "./MovieCard";
import '@/app/globals.css';

interface MovieRowProps {
  movies: {
    title: string;
    year: number;
    rating: number;
    poster: string;
  }[];
}

const MovieRow: React.FC<MovieRowProps> = ({ movies }) => {
  return (
    
    <div className="max-w-full h-70 px-1.5 py-1.5 rounded-sm bg-transparent">
      <div className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide">
        <div className="flex gap-10">
          {movies.map((movie, index) => (
            <div key={index} className="inline-block w-64 flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
