import React from "react";
import { Card, CardContent } from "./ui/card";

interface MovieCardProps {
  movie: {
    title: string;
    year: number;
    rating: number;
    poster: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="rounded-xl border-top-[#dfdfdf] transform transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ml-2.5 mt-2.5 w-[10rem]">
      <Card className="bg-[#0A1828] text-[#dfdfdf] hover:cursor-pointer">
        <div className="w-full h-60 bg-black rounded-xl flex items-center justify-center">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full object-contain rounded-xl"
          />
        </div>
        <CardContent className="p-2">
          <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{movie.year}</p>
          <span>⭐ {movie.rating}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieCard;
