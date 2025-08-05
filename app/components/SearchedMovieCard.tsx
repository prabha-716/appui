import React from "react";
import { Card, CardContent } from "./ui/card";

interface SearchedMovieCardProps {
  movie: {
    title: string;
    year: number;
    rating: number;
    poster: string;
    overview:string;
  
  };
}

const SearchedMovieCard: React.FC<SearchedMovieCardProps> = ({ movie }) => {
  return (
    <div className="rounded-xl border-2 border-[#0A1828] ">
      <Card className="bg-[#1C2C3A] text-white hover:cursor-pointer">
        <div className="flex">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-1/2 h-40 object-cover rounded-xl p-4"
        /><p className="p-4">{movie.overview}</p></div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <span className="text-sm bg-yellow-600 text-black px-2 py-0.5 rounded-full">✩{movie.rating}</span>
          </div>
          <p className="text-sm text-gray-400 mb-2">Year: {movie.year}</p>
          <div className="flex items-center gap-1 text-yellow-500 font-medium">
            <span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchedMovieCard;
