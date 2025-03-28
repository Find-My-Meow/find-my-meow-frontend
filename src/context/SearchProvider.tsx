import React, { useState } from "react";
import { SearchContext } from "./search-context";

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchState, setSearchState] = useState({
    image: null,
    location: null,
    radius: null,
    results: [],
    placeName: null,
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
