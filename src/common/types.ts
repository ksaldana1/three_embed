export type UMAP = [number, number, number];

export interface Embedding {
  id: string;
  name: string;
  umap: UMAP;
  umap_large: UMAP;
  neighbors: Array<EmbeddingNeighbors>;
  image_url: string;
}

export type DistanceFn = "L2" | "L1" | "Cosine" | "Inner_Product";

export type EmbeddingNeighbors = {
  distance: DistanceFn;
  neighbors: Array<Embedding["id"]>;
};

export interface Edge {
  to: Embedding;
  from: Embedding;
  distance: number;
}

export type Path = Edge[];

export interface Episode extends Embedding {
  episode: number;
  title: string;
  year: number;
  url: string;
  summary: string;
  speakers: string;
  details: string;
  cover_img_url: string;
  hash: string;
}

export const SCALING_FACTOR = 200;

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}
