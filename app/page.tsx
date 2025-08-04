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
import  { popularMovieStore } from '@/store/popularMovieStore'
const geist = Geist({
  subsets: ['latin'],
})

export default function PageLayout() {
  // const movies = useMovieStore((state) => state.movies);
  //  const { movies, isLoading, error, fetchMoreMovies } = popularMovieStore();
  //  const fetchAndRecommend = useMovieStore(state => state.fetchAndRecommend);
  //  const recommendedList = useMovieStore(state => state.recommendedList);
   const {
  popularMovies,
  recommendedList,
  fetchMoreMovies,
  fetchAndRecommend,
  isLoading,
  error
} = useMovieStore();

  useEffect(() => {
    fetchMoreMovies(); // Call only once on component mount
  }, [fetchMoreMovies]);
  return (
    <div className="min-h-screen bg-[#0A1828] text-[#dfdfdf] p-4 sm:p-6 ${geist.className}`">
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
              <p className="font-light sm:text-xl px-4">..</p>
            </div>

            <div className="relative w-full lg:w-[600px] h-[250px] lg:h-[280px]">
              <div className="absolute z-10 top-4 left-4 text-white text-xl font-sans">
                POPULAR
              </div>
              <MoviePosterScroller />
            </div>

          </div>

          <MovieRow movies={ popularMovies}  loadMoreMovies={fetchMoreMovies}/>
          <div className="border-t border-[#c7ae94] my-6" />
          <MovieRow movies={recommendedList} loadMoreMovies={fetchMoreMovies} />
          <div className="border-t border-[#c7ae94] my-6" />
          <MovieRow movies={recommendedList} loadMoreMovies={fetchMoreMovies}/>
          <div className="border-t border-[#c7ae94] my-6" />

        </div>
      </div>
    </div>
  );
}
