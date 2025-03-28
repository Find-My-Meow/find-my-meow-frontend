import { createContext, useContext } from "react";

export const SearchContext = createContext<any>(null);

export const useSearch = () => useContext(SearchContext);
