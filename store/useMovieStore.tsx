import { create } from "zustand";

interface Movie {
  title: string;
  year: number;
  rating: number;
  poster: string;
}

interface MovieStore {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  movies: [
    {
      title: "Inception",
      year: 2010,
      rating: 8.8,
      poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    },
    {
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    },
        {
      title: "Inception",
      year: 2010,
      rating: 8.8,
      poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    },
    {
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    },
        {
      title: "Inception",
      year: 2010,
      rating: 8.8,
      poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    },
    {
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    },
        {
      title: "Inception",
      year: 2010,
      rating: 8.8,
      poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    },
    {
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    },
  ],
  setMovies: (movies) => set({ movies }),
}));
