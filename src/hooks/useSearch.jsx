import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const SearchContext = createContext({
  openSearch: () => {},
});

export function SearchProvider({ children }) {
  const navigate = useNavigate();

  const openSearch = () => {
    navigate("/search");
  };

  return (
    <SearchContext.Provider value={{ openSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}