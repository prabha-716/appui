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
    <div className="rounded-xl border border-[#dfdfdf] hover:cursor-pointer">
      <Card className="bg-[#0A1828] text-[#dfdfdf] hover:cursor-pointer">
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
