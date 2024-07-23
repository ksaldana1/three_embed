import { useEffect, useMemo, useReducer } from "react";
import { generateEmbeddings } from "../common/data";
import { appReducer, Context } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    selectedId: null,
    embeddings: [],
    search: null,
  });

  useEffect(() => {
    generateEmbeddings().then((embeddings) => {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings } });
    });
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
