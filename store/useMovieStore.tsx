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
  searchedMovie: Movie | null; // The exact movie that was searched
  recommendedList: RecommendedMovie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchMoreMovies: () => Promise<void>;
  fetchAndRecommend: (query: string) => Promise<void>;
  clearSearch: () => void;
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

// String similarity function for better title matching
function titleSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match gets highest score
  if (s1 === s2) return 1;
  
  // Check if one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word overlap scoring
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(word => words2.includes(word));
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  popularMovies: [],
  searchedMovie: null,
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

  // Search for exact movie and recommend similar ones
  fetchAndRecommend: async (query: string) => {
    try {
      set({ isLoading: true, error: null, searchedMovie: null, recommendedList: [] });

      // 1. Search for the query movie with multiple pages for better matching
      let bestMatch: any = null;
      let bestScore = 0;
      
      // Search through multiple pages to find the best title match
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
        
        // If we found a very good match, break early
        if (bestScore >= 0.8) break;
      }

      if (!bestMatch) {
        console.warn("No matching movie found for query:", query);
        set({ searchedMovie: null, recommendedList: [], isLoading: false });
        return;
      }

      // Convert the searched movie to our Movie interface
      const searchedMovie: Movie = {
        title: bestMatch.title,
        rating: bestMatch.vote_average,
        year: Number(bestMatch.release_date?.split("-")[0]) || 0,
        poster: `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}`,
        genres: bestMatch.genre_ids || []
      };

      // Set the searched movie immediately so UI can display it
      set({ searchedMovie });

      const baseVector = genreToVector(bestMatch.genre_ids || []);

      // 2. Load movies for recommendations (25 pages)
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

      // 3. Calculate similarities (including all movies, even the searched one)
      const scored: RecommendedMovie[] = allMovies.map(movie => {
        const vec = genreToVector(movie.genres);
        return {
          ...movie,
          similarity: cosineSimilarity(baseVector, vec)
        };
      });

      // 4. Sort all movies by similarity
      const sortedMovies = scored
        .filter(m => m.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity);

      // 5. Create final recommended list with searched movie first
      const searchedMovieWithSimilarity: RecommendedMovie = {
        ...searchedMovie,
        similarity: 1 // Perfect similarity to itself
      };

      // Filter out the searched movie from sorted list and take top 49
      const otherRecommendations = sortedMovies
        .filter(movie => movie.title !== searchedMovie.title)
        .slice(0, 49);

      // Put searched movie first, then other recommendations
      const recommendedList = [searchedMovieWithSimilarity, ...otherRecommendations];

      set({ recommendedList, isLoading: false });
    } catch (err: any) {
      console.error("Error during fetchAndRecommend:", err);
      set({ searchedMovie: null, recommendedList: [], isLoading: false });
    }
  },

  // 🧹 Clear search results
  clearSearch: () => {
    set({ searchedMovie: null, recommendedList: [], error: null });
  }
}));