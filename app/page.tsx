"use client";
import { useEffect } from "react";
import React from "react";
import { useMovieStore } from "@/store/useMovieStore";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import MovieRow from "./components/MovieRow";
import MoviePosterScroller from "./components/MoviePosterScroller";
import '@/app/globals.css';
import { Geist } from 'next/font/google'
import SearchedMovieCard from "./components/SearchedMovieCard";

const geist = Geist({
  subsets: ['latin'],
})

export default function PageLayout() {
  const {
    popularMovies,
    searchedMovie,
    recommendedList,
    fetchMoreMovies,
    fetchAndRecommend,
    isLoading,
    error
  } = useMovieStore();

  useEffect(() => {
    fetchMoreMovies(); // Load popular movies on component mount
  }, [fetchMoreMovies]);

  return (
    <div className={`min-h-screen bg-[#0A1828] text-[#dfdfdf] p-4 sm:p-6 ${geist.className}`}>
      <div className="container mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">MOVIE RECOMMENDATION</h1>
        </header>

        <div className="flex flex-col justify-between gap-7">
          <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="w-full lg:w-[760px] border border-white rounded-lg">
              <p className="font-medium text-2xl sm:text-3xl p-4 sm:p-6">
                Search your movie here...
              </p>
              <div className="p-4 sm:p-6">
                <SearchBar />
              </div>
              {isLoading && (
                <p className="font-light sm:text-xl px-4 pb-4 text-[#dfdfdf">
                  Searching for movies...
                </p>
              )}
              {error && (
                <p className="font-light sm:text-xl px-4 pb-4 text-red-400">
                  Error: {error}
                </p>
              )}
            </div>

            <div className="relative w-full lg:w-[600px] h-[250px] lg:h-[280px]">
              <div className="absolute z-10 top-4 left-4 text-white text-xl font-sans">
                
              </div>
              {searchedMovie && <SearchedMovieCard movie={searchedMovie} />}

            </div>

          </div>

          {/* Recommended Movies Section - Only show if there are recommendations */}
          {recommendedList.length > 0 && (
            <>
              
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#c7ae94]">
                  Related Movies
                  {searchedMovie && (
                    <span className="text-2xl font-semibold text-[c7ae94]] ml-2">
                       TO {searchedMovie.title}
                    </span>
                  )}
                </h2>
                <MovieRow 
                  movies={recommendedList} 
                  loadMoreMovies={() => {}} // Recommendations don't need pagination
                />
              </div>
            </>
            
          )}
                    <div className="flex flex-col gap-4">
                      <div className="border-t border-[#c7ae94] my-6" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#c7ae94]">
              Popular Movies
            </h2>
            <MovieRow 
              movies={popularMovies} 
              loadMoreMovies={fetchMoreMovies}
            />
          </div>

          {/* Show message when search is performed but no recommendations found */}
          {searchedMovie && recommendedList.length === 0 && !isLoading && (
            <>
              <div className="border-t border-[#c7ae94] my-6" />
              <div className="text-center py-8">
                <p className="text-xl text-[#c7ae94]">
                  No similar movies found for "{searchedMovie.title}"
                </p>
                <p className="text-sm text-[#dfdfdf] mt-2">
                  Try searching for a different movie
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}