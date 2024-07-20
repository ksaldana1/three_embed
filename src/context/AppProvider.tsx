import { useEffect, useMemo, useReducer, useState } from "react";
import { appReducer, Context } from "./app";
import { Embedding, MODE } from "../common/types";
import { generateEmbeddings } from "../common/data";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, {
    mode: MODE.NEAREST_NEIGHBORS,
    selected: null,
  });

  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);

  useEffect(() => {
    generateEmbeddings().then((embeddings) => {
      setEmbeddings(embeddings);
    });
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, embeddings }),
    [state, dispatch, embeddings]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
