import React from "react";
import { Card ,CardContent } from "./ui/card";


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
    <Card className="bg-zinc-900 text-white">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-30 object-cover rounded-t-xl"
      />
      <CardContent className="p-4 h-">
        <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
        <p className="text-sm text-zinc-400 mb-2">{movie.year}</p>
        <div className="flex items-center gap-1 text-yellow-400">
          <span>{movie.rating}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
