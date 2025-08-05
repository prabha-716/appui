import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMovieStore } from "@/store/useMovieStore";
import { X } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const fetchAndRecommend = useMovieStore(state => state.fetchAndRecommend);
  const clearSearch = useMovieStore(state => state.clearSearch);
  const isLoading = useMovieStore(state => state.isLoading);
  const searchedMovie = useMovieStore(state => state.searchedMovie);

  const handleSearch = () => {
    if (!query.trim()) return;
    fetchAndRecommend(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    // If input is cleared, clear the search results
    if (newValue.trim() === "" && searchedMovie) {
      clearSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative w-1/2">
        <Input
          placeholder="Search movies..."
          className="pr-8"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {(query || searchedMovie) && (
          <Button
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        className="bg-[#0A1828] text-[#dfdfdf] border-[#dfdfdf] border hover:text-[#0A1828] hover:bg-[#dfdfdf] hover:cursor-pointer" 
        onClick={handleSearch}
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchBar;