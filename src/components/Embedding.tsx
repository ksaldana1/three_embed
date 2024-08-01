import type { Embedding } from "@ksaldana1/embeddings_backend";
import { animated, useSpring } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { SCALING_FACTOR } from "../common/types";
import { useSelector } from "@xstate/store/react";
import store from "../context";

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
  const selectedId = useSelector(store, (store) => store.context.selectedId);
  const hovered = useSelector(store, (store) => store.context.hovered);

  const position = useMemo(() => {
    const [x, y, z] = embedding.umap;
    return [
      x * scaleOrDefault,
      y * scaleOrDefault,
      z * scaleOrDefault,
    ] as const;
  }, [embedding.umap, scaleOrDefault]);

  const { position: embeddingPosition } = useSpring({
    position,
  });
  const { localScale } = useSpring({
    localScale: selectedId && !fade ? 2 : 1,
  });

  const { opacity } = useSpring({
    opacity:
      fade || (!!hovered && hovered !== embedding.id)
        ? embedding.id === selectedId
          ? 0.3
          : 0.02
        : 1,
  });

  return (
    <animated.mesh
      ref={ref}
      onDoubleClick={(e) => {
        if (selectedId) return;
        e.stopPropagation();
        onClick(embedding);
      }}
      position={embeddingPosition}
      scale={localScale}
      visible={!fade}
    >
      <animated.boxGeometry args={[100, 120, 1]} />
      <animated.meshBasicMaterial transparent map={texture} opacity={opacity} />
    </animated.mesh>
  );
}
