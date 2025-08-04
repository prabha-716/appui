import { create } from "zustand";

// Genre mapping
const genreMap: { [id: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};
const genreKeys = Object.keys(genreMap).map(Number);

// Movie type
interface Movie {
  title: string;
  rating: number;
  year: number;
  poster: string;
  genres: number[];
}

interface RecommendedMovie extends Movie {
  similarity: number;
}

interface MovieStore {
  popularMovies: Movie[];
  recommendedList: RecommendedMovie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchMoreMovies: () => Promise<void>;
  fetchAndRecommend: (query: string) => Promise<void>;
}

// Genre → binary vector
function genreToVector(genreIDs: number[]): number[] {
  return genreKeys.map(id => genreIDs.includes(id) ? 1 : 0);
}

// Cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] ** 2;
    magB += vecB[i] ** 2;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  popularMovies: [],
  recommendedList: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,

  // 🔁 Load more popular movies
  fetchMoreMovies: async () => {
    const { page, isLoading, hasMore } = get();
    if (isLoading || !hasMore) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=e7c13ee2167cafbdce5d4a8eda2e0587&language=en-US&page=${page}`);
      const data = await res.json();

      const newMovies = data.results.map((movie: any) => ({
        title: movie.title,
        rating: movie.vote_average,
        year: Number(movie.release_date?.split("-")[0]) || 0,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        genres: movie.genre_ids || []
      }));

      set(state => ({
        popularMovies: [...state.popularMovies, ...newMovies],
        page: page + 1,
        hasMore: data.page < data.total_pages,
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 🎯 Recommend similar movies to a query
  fetchAndRecommend: async (query: string) => {
    try {
      set({ isLoading: true, error: null });

      // 1. Search the query movie
      const queryRes = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=e7c13ee2167cafbdce5d4a8eda2e0587`);
      const queryData = await queryRes.json();
      const baseMovie = queryData.results?.[0];
      if (!baseMovie) {
        console.warn("No query movie found.");
        set({ recommendedList: [], isLoading: false });
        return;
      }

      const baseVector = genreToVector(baseMovie.genre_ids || []);

      // 2. Load 25 pages of movies
      let allMovies: Movie[] = [];
      for (let page = 1; page <= 25; page++) {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=e7c13ee2167cafbdce5d4a8eda2e0587&page=${page}`);
        const data = await res.json();
        const batch = data.results.map((movie: any) => ({
          title: movie.title,
          rating: movie.vote_average,
          year: Number(movie.release_date?.split("-")[0]) || 0,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genres: movie.genre_ids || []
        }));
        allMovies = allMovies.concat(batch);
      }

      // 3. Calculate similarities
      const scored: RecommendedMovie[] = allMovies.map(movie => {
        const vec = genreToVector(movie.genres);
        return {
          ...movie,
          similarity: cosineSimilarity(baseVector, vec)
        };
      });

      // 4. Sort top 50 similar
      const recommendedList = scored
        .filter(m => m.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 50);

      set({ recommendedList, isLoading: false });
    } catch (err: any) {
      console.error("Error during fetchAndRecommend:", err);
      set({ recommendedList: [], isLoading: false });
    }
  }
}));
