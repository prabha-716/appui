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
        <h1 className="text-6xl font-sans">MOVIE RECOMMENDATION</h1>
      </header>
      </div>
      <div className="flex flex-col justify-between gap-7">
      <div className="h-85 border border-[#c7ae94] ">
        <p className="px-3.5 py-3.5 text-4xl font-sans">search your movie here..</p>
              <div className=" px-3.5 py-3.5 ml-20"><SearchBar /></div>
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