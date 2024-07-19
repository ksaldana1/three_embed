import { useMemo, useReducer } from "react";
import { appReducer, Context } from "./app";
import { MODE } from "../common/types";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    mode: MODE.NEAREST_NEIGHBORS,
    selected: null,
  });

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
