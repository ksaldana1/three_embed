import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Embedding, SCALING_FACTOR } from "../common/types";
import { useSpring, animated } from "@react-spring/three";

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
    return [
      x * SCALING_FACTOR,
      y * SCALING_FACTOR,
      z * SCALING_FACTOR,
    ] as const;
  }, [embedding.umap]);

  const fade =
    selectedEmbedding &&
    embedding.id !== selectedEmbedding?.id &&
    !selectedEmbedding?.neighbors.includes(embedding.id);

  const { opacity } = useSpring({ opacity: fade ? 0.2 : 1 });

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
      <animated.meshBasicMaterial transparent map={texture} opacity={opacity} />
    </mesh>
  );
}
