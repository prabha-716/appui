import { create } from 'zustand';

interface Movie {
  title: string;
  rating: number;
  year: number;
  poster: string;
}

interface MovieStore {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchMoreMovies: () => Promise<void>;
}

export const popularMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchMoreMovies: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=e7c13ee2167cafbdce5d4a8eda2e0587&language=en-US&page=${page}`
      );
      const data = await res.json();

      const newMovies = data.results.map((movie: any) => ({
        title: movie.title,
        rating: movie.vote_average,
        year: Number(movie.release_date?.split('-')[0]) || 0,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }));

      set((state) => ({
        movies: [...state.movies, ...newMovies],
        page: state.page + 1,
        hasMore: data.page < data.total_pages,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
