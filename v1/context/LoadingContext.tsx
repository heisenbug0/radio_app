import { createContext, useState } from "react";

export const LoadingContext = createContext<GlobalContent>({
  loadingStatus: true,
  setLoadingStatus: () => {},
});

export const LoadingProvider = ({ children }: { children: JSX.Element }) => {
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  return (
    <LoadingContext.Provider value={{ loadingStatus, setLoadingStatus }}>
      {children}
    </LoadingContext.Provider>
  );
};
