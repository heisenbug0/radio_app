import { createContext, useEffect, useState } from "react";

const initialValues = {
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  priceRange: "",
  searchInput: "",
  postedSince: "",
  propType: "",
  city: "",
  state: "",
  country: "",
};
export const SearchContext = createContext<SearchContextProps>({
  queries: initialValues,
  setQueries: (queries: SearchProps) => queries,
});

export const SearchProvider = ({ children }: { children: JSX.Element }) => {
  const [queries, setQueries] = useState<SearchProps>(() => {
    const storeQuery =
      typeof window !== "undefined" && localStorage.getItem("queries");
    return storeQuery ? JSON.parse(storeQuery) : initialValues;
  });

  useEffect(() => {
    localStorage.setItem("queries", JSON.stringify(queries));
  }, [queries]);

  return (
    <SearchContext.Provider value={{ queries, setQueries }}>
      {children}
    </SearchContext.Provider>
  );
};
