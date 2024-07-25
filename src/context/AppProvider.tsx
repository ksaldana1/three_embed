import { useEffect, useMemo, useReducer } from "react";
import { fetchEmbeddings } from "../common/data";
import { appReducer, Context } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    selectedId: null,
    embeddings: [],
    search: null,
    distanceFn: "Cosine",
    model: "text-embedding-3-small",
  });

  useEffect(() => {
    fetchEmbeddings(state.model).then((embeddings) => {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings } });
    });
  }, [state.model]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
