import type { EmbeddingModel } from "@ksaldana1/embeddings_backend";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";
import { fetchEmbeddings } from "../common/data";
import { appReducer, Context } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    selectedId: null,
    embeddings: [],
    model: "text-embedding-3-small",
    hovered: null,
  });

  const { data } = useQuery({
    queryKey: ["embeddings", state.model],
    queryFn: ({ queryKey }) => {
      return fetchEmbeddings(queryKey.at(-1) as EmbeddingModel);
    },
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings: data } });
    }
  }, [data]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
