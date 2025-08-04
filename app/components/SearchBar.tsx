import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMovieStore } from "@/store/useMovieStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const fetchAndRecommend = useMovieStore(state => state.fetchAndRecommend);
  const isLoading = useMovieStore(state => state.isLoading);

  const handleSearch = () => {
    if (!query.trim()) return;
    fetchAndRecommend(query.trim());
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search movies..."
        className="w-1/2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button
        className="bg-[#0A1828] text-[#dfdfdf] border-[#dfdfdf] border hover:text-[#0A1828] hover:bg-[#dfdfdf]  hover:cursor-pointer" 
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchBar;
