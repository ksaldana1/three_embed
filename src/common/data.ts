import EPISODES from "../../public/episodes_en.json";
import { client } from "./client";
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

export const generateEmbeddings: () => Promise<Embedding[]> = async () => {
  const { data } = await client.from("movies").select("imdbID, umap, Poster");
  const resp: Embedding[] = data!.map((movie) => ({
    ...movie,
    id: movie.imdbID,
    neighbors: [],
    image_url: movie.Poster ?? "",
    // @ts-expect-error umap types are weird
    umap: JSON.parse(movie.umap) as UMAP,
  }));
  return resp;
};
