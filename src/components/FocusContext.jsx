import { createContext, useContext, useEffect, useState } from "react";

// "dev" or "data": which side of the profile is highlighted. Drives the accent color.
const FocusContext = createContext({ focus: "dev", setFocus: () => {} });

export function FocusProvider({ children }) {
  const [focus, setFocus] = useState("dev");

  useEffect(() => {
    document.documentElement.dataset.focus = focus;
  }, [focus]);

  return <FocusContext.Provider value={{ focus, setFocus }}>{children}</FocusContext.Provider>;
}

export const useFocus = () => useContext(FocusContext);
