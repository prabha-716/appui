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
    <div className="rounded-xl border border-amber-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:cursor-pointer">
      <Card className="bg-[#FFFDF2] text-gray-800 hover:cursor-pointer">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{movie.year}</p>
          <div className="flex items-center gap-1 text-yellow-600 font-medium">
            <span>⭐ {movie.rating}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieCard;
