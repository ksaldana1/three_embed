import { Json } from "../generated/database.types";
import { client } from "./client";
import { DistanceFn, Embedding, EmbeddingNeighbors, UMAP } from "./types";

export const generateEmbeddings: () => Promise<Embedding[]> = async () => {
  const { data } = await client
    .from("movies")
    .select("imdbID, umap, Poster, Title, Director, umap_large");

  const { data: neighborData } = await client
    .from("movie_neighbors_all_distances")
    .select("*");

  const neighbors = neighborData!.map((row) => {
    return [
      {
        distanceFn: "Cosine" satisfies DistanceFn,
        neighbors: fromJSON(row.cosine_neighbors),
      },
      {
        distanceFn: "L1" as const satisfies DistanceFn,
        neighbors: fromJSON(row.l1_neighbors),
      },
      {
        distanceFn: "L2" satisfies DistanceFn,
        neighbors: fromJSON(row.l2_neighbors),
      },
      {
        distanceFn: "Inner_Product" satisfies DistanceFn,
        neighbors: fromJSON(row.negative_inner_product_neighbors),
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

function fromJSON(x: Json): EmbeddingNeighbors["neighbors"] {
  if (typeof x !== "object") {
    throw new Error("JSON must be object");
  }
  if (typeof x !== "object" && !x["id"] && !x["distance"]) {
    throw new Error("MISSING ID AND NEIGHBORS from data");
  }
  return x as EmbeddingNeighbors["neighbors"];
}
