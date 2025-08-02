"use client";

import React from "react";
import { useMovieStore } from "@/store/useMovieStore";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import MovieRow from "./components/MovieRow";

export default function PageLayout() {
  const movies = useMovieStore((state) => state.movies);

  return (
    <div className="min-h-screen bg-[#FFFDF2] text-[#323232] p-6 flex-row font-sans">
      <div>
        <header className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-sans ">MOVIE RECOMMENDATION</h1>
      </header>
      </div>
      <div className="flex flex-col justify-between gap-7">
        
      <div className="h-70 border border-[#c7ae94] p-6">
        <p className="font-sans font-medium text-3xl">Search your movie here...</p>
              <div className="p-6"><SearchBar /></div>
      </div>
      <MovieRow movies={movies}/>
      <div className="border-t border-[#c7ae94] my-6" />
      <MovieRow movies={movies}/>
      <div className="border-t border-[#c7ae94] my-6" />
      <MovieRow movies={movies}/>
      <div className="border-t border-[#c7ae94] my-6" />

      </div>
    </div>
  );
}