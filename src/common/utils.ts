import { Embedding, UMAP, Edge, Path } from "./types";

/**
 * Calculates the Euclidean distance between two UMAP points.
 * @param umap1 - The first UMAP point
 * @param umap2 - The second UMAP point
 * @returns The Euclidean distance between the two points
 */
function calculateDistance(umap1: UMAP, umap2: UMAP): number {
  return Math.sqrt(
    Math.pow(umap1[0] - umap2[0], 2) +
      Math.pow(umap1[1] - umap2[1], 2) +
      Math.pow(umap1[2] - umap2[2], 2)
  );
}

/**
 * Implements Dijkstra's algorithm to find the shortest path between two embeddings.
 * @param embeddings - Array of all embeddings
 * @param startId - ID of the starting embedding
 * @param endId - ID of the ending embedding
 * @returns An object containing the path and total distance, or null if no path is found
 */
export function dijkstra(
  embeddings: Embedding[],
  startId: string,
  endId: string
): { path: Path; totalDistance: number } | null {
  if (startId === endId) {
    throw new Error("Start and end nodes are the same");
  }

  const distances: { [id: string]: number } = {};
  const previous: { [id: string]: string | null } = {};
  const unvisited = new Set<string>();

  // Initialize distances, previous nodes, and the unvisited set
  embeddings.forEach((embedding) => {
    distances[embedding.id] = embedding.id === startId ? 0 : Infinity;
    previous[embedding.id] = null;
    unvisited.add(embedding.id);
  });

  while (unvisited.size > 0) {
    // Select the unvisited node with the smallest distance
    const current = Array.from(unvisited).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    // If we've reached the end or there's no path, exit the loop
    if (current === endId || distances[current] === Infinity) {
      break;
    }

    unvisited.delete(current);

    const currentEmbedding = embeddings.find((e) => e.id === current);
    if (!currentEmbedding) continue;

    // Check all neighboring nodes
    for (const neighborId of currentEmbedding.neighbors) {
      if (!unvisited.has(neighborId)) continue;

      const neighbor = embeddings.find((e) => e.id === neighborId);
      if (!neighbor) continue;

      // Calculate the distance to the neighbor through the current node
      const distance = calculateDistance(currentEmbedding.umap, neighbor.umap);
      const totalDistance = distances[current] + distance;

      // If this path to the neighbor is shorter, update it
      if (totalDistance < distances[neighborId]) {
        distances[neighborId] = totalDistance;
        previous[neighborId] = current;
      }
    }
  }

  // If no path was found to the end node, return null
  if (previous[endId] === null) {
    return null;
  }

  // Reconstruct the path
  const path: Path = [];
  let current: string | null = endId;
  let prev: string | null = previous[endId];

  while (prev !== null) {
    const fromEmbedding = embeddings.find((e) => e.id === prev);
    const toEmbedding = embeddings.find((e) => e.id === current);

    if (fromEmbedding && toEmbedding) {
      const edge: Edge = {
        from: fromEmbedding,
        to: toEmbedding,
        distance: calculateDistance(fromEmbedding.umap, toEmbedding.umap),
      };
      path.unshift(edge);
    }

    current = prev;
    prev = previous[current];
  }

  return { path, totalDistance: distances[endId] };
}
