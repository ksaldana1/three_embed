import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Embedding } from "../common/types";

export const SCALING = 50;

interface EmbeddingProps {
  embedding: Embedding;
  onClick: (embedding: Embedding | null) => void;
  selectedEmbedding: Embedding | null;
}

export function Embed({
  embedding,
  onClick,
  selectedEmbedding,
}: EmbeddingProps) {
  const imageName = embedding.id.padStart(3, "0");
  const texture = useTexture(`../imgs/${imageName}.jpg`);
  const ref = useRef<Mesh>(null!);

  const position = useMemo(() => {
    const [x, y, z] = embedding.umap;
    return [x * SCALING, y * SCALING, z * SCALING] as const;
  }, [embedding.umap]);

  return (
    <mesh
      ref={ref}
      onPointerEnter={() => {
        onClick(embedding);
      }}
      onPointerOut={() => onClick(null)}
      position={position}
    >
      <boxGeometry args={[10, 10, 1]} />
      <meshBasicMaterial
        transparent
        map={texture}
        opacity={
          embedding === selectedEmbedding ||
          !selectedEmbedding ||
          selectedEmbedding.neighbors.includes(embedding.id)
            ? 1
            : 0.2
        }
      />
    </mesh>
  );
}
