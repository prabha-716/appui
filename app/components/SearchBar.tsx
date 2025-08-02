import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMovieStore } from "@/store/useMovieStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { movies, setMovies } = useMovieStore();

  const handleSearch = () => {
    const allMovies = useMovieStore.getState().movies;
    const filtered = allMovies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    setMovies(filtered.length ? filtered : allMovies);
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search movies..."
        className="w-1/2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        className="bg-[#0A1828] text-[#dfdfdf] border-[#dfdfdf] border hover:text-[#0A1828] hover:bg-[#dfdfdf]  hover:cursor-pointer" 
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
