export type UMAP = [number, number, number];

export interface Embedding {
  id: string;
  name: string;
  director: string;
  umap: UMAP;
  neighbors: Array<EmbeddingNeighbors>;
  image_url: string;
}

export type DistanceFn = "L2" | "L1" | "Cosine" | "Inner_Product";

export type EmbeddingNeighbors = {
  distanceFn: DistanceFn;
  neighbors: Array<{
    id: Embedding["id"];
    distance: number;
  }>;
};

export const SCALING_FACTOR = 400;

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

export type EmbeddingModel =
  | "nomic-embed-text-v1.5"
  | "text-embedding-3-small"
  | "text-embedding-3-large"
  | "mxbai-embed-large";
