import { Embedding, EmbeddingModel } from "./types";

import { edenTreaty } from "@elysiajs/eden";
import type { App } from "embeddings-backend/src/server/app";

const client = edenTreaty<App>(import.meta.env.VITE_API_URL);

export const fetchEmbeddings: (
  model?: EmbeddingModel
) => Promise<Embedding[]> = async (model) => {
  const { data } = await client.movies.get({
    $query: { model: model ?? "text-embedding-3-small" },
  });
  return data ?? ([] as Embedding[]);
};
