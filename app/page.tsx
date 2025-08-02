"use client";

import React from "react";
import { useMovieStore } from "@/store/useMovieStore";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import MovieRow from "./components/MovieRow";
import MoviePosterScroller from "./components/MoviePosterScroller";
import '@/app/globals.css';

export default function PageLayout() {
  const movies = useMovieStore((state) => state.movies);

  return (
    <div className="min-h-screen bg-[#0A1828] text-[#dfdfdf] p-6 flex-row font-sans">
      <div>
        <header className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-sans ">MOVIE RECOMMENDATION</h1>
      </header>
      </div>
      <div className="flex flex-col justify-between gap-7">
        
      <div className="h-70 border border-[#c7ae94] ">
        <div className="flex justify-between">
          <div className="w-190 border border-white"><p className="font-sans font-medium text-3xl p-6">Search your movie here...</p>
              <div className="p-6"><SearchBar /></div></div>
              <div className=" h-70 border border-[#c7ae94] w-150 justify-center">
                <MoviePosterScroller/></div></div>
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