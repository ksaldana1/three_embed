import { useEffect, useMemo, useReducer } from "react";
import { fetchEmbeddings, fetchSearch } from "../common/data";
import { appReducer, Context } from "./app";
import { useQuery } from "@tanstack/react-query";
import type { EmbeddingModel } from "@ksaldana1/embeddings_backend";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    selectedId: null,
    embeddings: [],
    search: "tt6263850",
    model: "text-embedding-3-small",
    hovered: null,
  });

  const { data } = useQuery({
    queryKey: ["embeddings", state.model],
    queryFn: ({ queryKey }) =>
      fetchEmbeddings(queryKey.at(-1) as EmbeddingModel),
  });

  const { data: searchData } = useQuery({
    queryKey: ["user_embeddings", state.search],
    queryFn: ({ queryKey }) => fetchSearch(queryKey.at(-1) as string),
  });

  console.log(searchData);

  useEffect(() => {
    if (data) {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings: data } });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      dispatch({ type: "EMBEDDINGS_RECEIVED", payload: { embeddings: data } });
    }
  }, [data]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
