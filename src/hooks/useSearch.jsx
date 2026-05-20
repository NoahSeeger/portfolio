import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchContext = createContext({
  openSearch: () => {},
  closeSearch: () => {},
});

export function SearchProvider({ children }) {
  const navigate = useNavigate();

  const openSearch = () => {
    navigate("/search");
  };

  return (
    <SearchContext.Provider
      value={{
        openSearch,
        closeSearch: () => navigate(-1),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}