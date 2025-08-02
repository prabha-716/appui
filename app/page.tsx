"use client";

import React from "react";
import { useMovieStore } from "@/store/useMovieStore";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";

export default function PageLayout() {
  const movies = useMovieStore((state) => state.movies);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex-row">
      <div>
        <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">MOVIE RECOMMENDATION</h1>
        <SearchBar />
      </header>
      </div>
      <div className="flex flex-col justify-between gap-7">
      <div className="h-60 border border-amber-300">

      </div>
      <div className="max-w- h-70 px-1.5 py-1.5 border-amber-200 border ">

      <div className="overflow-x-auto whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {movies.map((movie, index) => (
            <div key={index} className="inline-block w-64 flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      </div>
            <div className="max-w- h-70 px-1.5 py-1.5 border-amber-200 border ">
      <div className="overflow-x-auto whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {movies.map((movie, index) => (
            <div key={index} className="inline-block w-64 flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      </div>
            <div className="max-w- h-70 px-1.5 py-1.5 border-amber-200 border ">
      <div className="overflow-x-auto whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {movies.map((movie, index) => (
            <div key={index} className="inline-block w-64 flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}