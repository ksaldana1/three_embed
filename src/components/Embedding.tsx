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
  const texture = useTexture(embedding.image_url);
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

  const { opacity } = useSpring({ opacity: fade ? 0.05 : 1 });
  const { position: embeddingPosition } = useSpring({
    position,
  });

  return (
    <animated.mesh
      ref={ref}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick(embedding);
      }}
      position={embeddingPosition}
    >
      <boxGeometry args={[50, 50, 0.5]} />
      <animated.meshBasicMaterial transparent map={texture} opacity={opacity} />
    </animated.mesh>
  );
}
