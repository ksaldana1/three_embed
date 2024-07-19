import { animated, useSpring } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Embedding, SCALING_FACTOR } from "../common/types";

interface EmbeddingProps {
  embedding: Embedding;
  onClick: (embedding: Embedding | null) => void;
  scale?: number;
  fade?: boolean;
}

export function Embed({ embedding, onClick, scale, fade }: EmbeddingProps) {
  const imageName = embedding.id.padStart(3, "0");
  const texture = useTexture(`../../imgs/${imageName}.jpg`);
  const ref = useRef<Mesh>(null!);
  const scaleOrDefault = scale ?? SCALING_FACTOR;

  const position = useMemo(() => {
    const [x, y, z] = embedding.umap;
    return [
      x * scaleOrDefault,
      y * scaleOrDefault,
      z * scaleOrDefault,
    ] as const;
  }, [embedding.umap, scaleOrDefault]);

  const { opacity } = useSpring({ opacity: fade ? 0.2 : 1 });

  return (
    <mesh
      ref={ref}
      onClick={() => {
        onClick(embedding);
      }}
      position={position}
    >
      <boxGeometry args={[10, 10, 1]} />
      <animated.meshBasicMaterial transparent map={texture} opacity={opacity} />
    </mesh>
  );
}
