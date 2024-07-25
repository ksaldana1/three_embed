import { animated, useSpring } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Embedding, SCALING_FACTOR, UMAP } from "../common/types";
import { useAppContext } from "../context/app";

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
  const { state } = useAppContext();

  const position = useMemo(() => {
    const [x, y, z] = embedding.umap;
    return [
      x * scaleOrDefault,
      y * scaleOrDefault,
      z * scaleOrDefault,
    ] as const;
  }, [embedding.umap, scaleOrDefault]);

  const { opacity } = useSpring({ opacity: fade ? 0.02 : 1 });
  const { position: embeddingPosition } = useSpring({
    position,
  });
  const { localScale } = useSpring({
    localScale: state.selectedId && !fade ? 2 : 1,
  });

  return (
    <animated.mesh
      ref={ref}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick(embedding);
      }}
      position={embeddingPosition}
      scale={localScale}
    >
      <animated.boxGeometry args={[100, 100, 1]} />
      <animated.meshBasicMaterial transparent map={texture} opacity={opacity} />
    </animated.mesh>
  );
}
