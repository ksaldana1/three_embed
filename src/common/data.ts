import { Embedding, EmbeddingModel } from "./types";

export const fetchEmbeddings: (
  model?: EmbeddingModel
) => Promise<Embedding[]> = async (model) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/movies?model=${
      model ?? "text-embedding-3-small"
    }`
  );
  const json = await response.json();
  // this is where there'd be a generated client
  // IF I HAD ONE
  return json.data as Embedding[];
};
