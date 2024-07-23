import EPISODES from "../../public/episodes_en.json";
import { client } from "./client";
import { Embedding, UMAP } from "./types";

export const EMBEDDINGS: Embedding[] = EPISODES.map((episode) => {
  return {
    ...episode,
    id: episode.episode.toString(),
    name: episode.title,
    neighbors: episode.neighbors.map((id) => id.toString()),
    umap: episode.umap as UMAP,
    umap_large: episode.umap as UMAP,
    image_url: episode.cover_img_url,
  };
});

export const generateEmbeddings: () => Promise<Embedding[]> = async () => {
  const { data } = await client
    .from("movies")
    .select("imdbID, umap, Poster, Title, Director, umap_large");

  const { data: neighborData } = await client
    .from("movie_neighbors")
    .select("*");
  const resp: Embedding[] = data!.map((movie) => ({
    ...movie,
    id: movie.imdbID,
    name: movie.Title ?? "",
    neighbors:
      neighborData?.find((m) => m.imdbID === movie.imdbID)?.neighbor_ids ?? [],
    image_url: movie.Poster ?? "",
    // @ts-expect-error umap types are weird
    umap: JSON.parse(movie.umap) as UMAP,
    // @ts-expect-error umap types are weird
    umap_large: JSON.parse(movie.umap_large) as UMAP,
  }));
  return resp;
};
