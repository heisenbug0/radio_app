import { createContext, useEffect, useState } from "react";

export const TempContext = createContext<any>({
  val: "",
  setQueries: (val: any) => val,
});

export default function TempValueProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [val, setVal] = useState<unknown>(() => {
    const storedTempValue =
      typeof window !== "undefined" && localStorage.getItem("temp");
    return storedTempValue ? JSON.parse(storedTempValue) : "";
  });

  useEffect(() => {
    localStorage.setItem("temp", JSON.stringify(val));
  }, [val]);

  return (
    <TempContext.Provider value={{ val, setVal }}>
      {children}
    </TempContext.Provider>
  );
}
