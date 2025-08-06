import { create } from "zustand";

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};
const genreKeys = Object.keys(genreMap).map(Number);

interface Movie {
  title: string;
  rating: Number;
  year: number;
  poster: string;
  genres: number[];
  overview: string;
  movie_id: number;
}

interface RecommendedMovie extends Movie {
  similarity: number;
}

interface MovieStore {
  popularMovies: Movie[];
  searchedMovie: Movie | null;
  recommendedList: RecommendedMovie[];
  movieListOfDirecter: Movie[];
  movieListOfCast: Movie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchMoreMovies: () => Promise<void>;
  fetchAndRecommend: (query: string) => Promise<void>;
  clearSearch: () => void;
}

function genreToVector(genreIDs: number[]): number[] {
  return genreKeys.map(id => genreIDs.includes(id) ? 1 : 0);
}

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

function titleSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  popularMovies: [],
  searchedMovie: null,
  recommendedList: [],
  movieListOfDirecter: [],
  movieListOfCast: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchMoreMovies: async () => {
    const { page, isLoading, hasMore } = get();
    if (isLoading || !hasMore) return;
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=e7c13ee2167cafbdce5d4a8eda2e0587&language=en-US&page=${page}`);
      const data = await res.json();
      const newMovies = data.results.map((movie: any) => ({
        title: movie.title,
        rating: Number(movie.vote_average).toFixed(1),
        year: Number(movie.release_date?.split("-")[0]) || 0,
        poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
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

  fetchAndRecommend: async (query: string) => {
    try {
      set({ isLoading: true, error: null, searchedMovie: null, recommendedList: [], movieListOfDirecter: [], movieListOfCast: [] });

      let bestMatch: any = null;
      let bestScore = 0;
      for (let page = 1; page <= 3; page++) {
        const queryRes = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=e7c13ee2167cafbdce5d4a8eda2e0587&page=${page}`);
        const queryData = await queryRes.json();

        for (const movie of queryData.results || []) {
          const score = titleSimilarity(query, movie.title);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = movie;
          }
        }
        if (bestScore >= 0.8) break;
      }

      if (!bestMatch) {
        set({ searchedMovie: null, recommendedList: [], isLoading: false });
        return;
      }

      const searchedMovie: Movie = {
        title: bestMatch.title,
        rating: Number(bestMatch.vote_average),
        year: Number(bestMatch.release_date?.split("-")[0]) || 0,
        poster: `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}`,
        genres: bestMatch.genre_ids || [],
        overview: bestMatch.overview,
        movie_id: bestMatch.id,
      };

      set({ searchedMovie });

      // ➤ Fetch credits to get cast & director
      const creditRes = await fetch(`https://api.themoviedb.org/3/movie/${bestMatch.id}/credits?api_key=e7c13ee2167cafbdce5d4a8eda2e0587`);
      const creditData = await creditRes.json();

      const topCast = creditData.cast.slice(0, 3);
      const director = creditData.crew.find((member: any) => member.job === "Director");

      let movieListOfCast: Movie[] = [];
      let movieListOfDirecter: Movie[] = [];

      for (const actor of topCast) {
        const actorRes = await fetch(`https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=e7c13ee2167cafbdce5d4a8eda2e0587`);
        const actorData = await actorRes.json();
        const actorMovies = actorData.cast.map((m: any) => ({
          title: m.title,
          rating: Number(m.vote_average).toFixed(1),
          year: Number(m.release_date?.split("-")[0]) || 0,
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          genres: m.genre_ids || [],
          overview: m.overview,
          movie_id: m.id
        }));
        movieListOfCast = [...movieListOfCast, ...actorMovies];
      }

      if (director) {
        const dirRes = await fetch(`https://api.themoviedb.org/3/person/${director.id}/movie_credits?api_key=e7c13ee2167cafbdce5d4a8eda2e0587`);
        const dirData = await dirRes.json();
        const dirMovies = dirData.crew
          .filter((m: any) => m.job === "Director")
          .map((m: any) => ({
            title: m.title,
            rating: m.vote_average,
            year: Number(m.release_date?.split("-")[0]) || 0,
            poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
            genres: m.genre_ids || [],
            overview: m.overview,
            movie_id: m.id
          }));
        movieListOfDirecter = dirMovies;
      }

      const baseVector = genreToVector(bestMatch.genre_ids || []);

      let allMovies: Movie[] = [];
      for (let page = 1; page <= 25; page++) {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=e7c13ee2167cafbdce5d4a8eda2e0587&page=${page}`);
        const data = await res.json();
        const batch = data.results.map((movie: any) => ({
          title: movie.title,
          rating: movie.vote_average,
          year: Number(movie.release_date?.split("-")[0]) || 0,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genres: movie.genre_ids || [],
          overview: movie.overview,
          movie_id: movie.id
        }));
        allMovies = allMovies.concat(batch);
      }

      const scored: RecommendedMovie[] = allMovies.map(movie => {
        const vec = genreToVector(movie.genres);
        return {
          ...movie,
          similarity: cosineSimilarity(baseVector, vec)
        };
      });

      const sortedMovies = scored
        .filter(m => m.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity);

      const searchedMovieWithSimilarity: RecommendedMovie = {
        ...searchedMovie,
        similarity: 1
      };

      const otherRecommendations = sortedMovies
        .filter(movie => movie.title !== searchedMovie.title)
        .slice(0, 49);

      const recommendedList = [searchedMovieWithSimilarity, ...otherRecommendations];

      set({ recommendedList, isLoading: false, movieListOfCast, movieListOfDirecter });

    } catch (err: any) {
      set({ searchedMovie: null, recommendedList: [], isLoading: false, error: err.message });
    }
  },

  clearSearch: () => {
    set({ searchedMovie: null, recommendedList: [], error: null });
  }
}));
