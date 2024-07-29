import { useEffect, useMemo, useReducer } from "react";
import { fetchEmbeddings } from "../common/data";
import { appReducer, Context } from "./app";
import { useQuery } from "@tanstack/react-query";
import { EmbeddingModel } from "../common/types";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    selectedId: null,
    embeddings: [],
    search: [-1.89443403410225, 1.3025660829957, 0.996972394419308],
    distanceFn: "Cosine",
    model: "text-embedding-3-small",
    hovered: null,
  });

  const { data } = useQuery({
    queryKey: ["embeddings", state.model],
    queryFn: ({ queryKey }) =>
      fetchEmbeddings(queryKey.at(-1) as EmbeddingModel),
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings: data } });
    }
  }, [data]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
