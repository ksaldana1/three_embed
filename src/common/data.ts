import { treaty } from "@elysiajs/eden";
import type {
  Server,
  Embedding,
  EmbeddingModel,
} from "@ksaldana1/embeddings_backend";

const client = treaty<Server>(import.meta.env.VITE_API_URL);

export const fetchEmbeddings: (
  model?: EmbeddingModel
) => Promise<Embedding[]> = async (model) => {
  const { data } = await client.movies.get({
    query: { model: model ?? "text-embedding-3-small" },
  });
  return data ?? ([] as Embedding[]);
};
