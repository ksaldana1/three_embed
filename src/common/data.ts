import { client } from "./client";
import { DistanceFn, Embedding, EmbeddingNeighbors, UMAP } from "./types";

export const generateEmbeddings: () => Promise<Embedding[]> = async () => {
  const { data } = await client
    .from("movies")
    .select("imdbID, umap, Poster, Title, Director, umap_large");

  const { data: neighborData } = await client
    .from("movie_neighbors_all")
    .select("*");

  const neighbors = neighborData!.map((row) => {
    return [
      {
        distance: "Cosine" satisfies DistanceFn,
        neighbors: row.cosine_neighbor_ids!,
      },
      {
        distance: "L1" as const satisfies DistanceFn,
        neighbors: row.l1_neighbor_ids!,
      },
      {
        distance: "L2" satisfies DistanceFn,
        neighbors: row.l2_neighbor_ids!,
      },
      {
        distance: "Inner_Product" satisfies DistanceFn,
        neighbors: row.l1_neighbor_ids!,
      },
    ] satisfies EmbeddingNeighbors[];
  });
  const resp: Embedding[] = data!.map((movie, index) => ({
    ...movie,
    id: movie.imdbID,
    name: movie.Title ?? "",
    neighbors: neighbors[index],
    image_url: movie.Poster ?? "",
    // @ts-expect-error umap types are weird
    umap: JSON.parse(movie.umap) as UMAP,
    // @ts-expect-error umap types are weird
    umap_large: JSON.parse(movie.umap_large) as UMAP,
  }));
  return resp;
};
