import EPISODES from "../../public/episodes_en.json";
import { Embedding, UMAP } from "./types";

export const EMBEDDINGS: Embedding[] = EPISODES.map((episode) => {
  return {
    ...episode,
    id: episode.episode.toString(),
    neighbors: episode.neighbors.map((id) => id.toString()),
    umap: episode.umap as UMAP,
    image_url: episode.cover_img_url,
  };
});
