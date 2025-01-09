import type {
  Embedding,
  EmbeddingModel,
  UMAP,
} from "@ksaldana1/embeddings_backend";
import { Line, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { Controls, SCALING_FACTOR } from "../common/types";
import store from "../context";
import { useSelector } from "@xstate/store/react";
import { Embed } from "./Embedding";
import { ErrorBoundary } from "react-error-boundary";

export function World({ center }: { center: () => void }) {
  const embeddings = useSelector(store, (store) => store.context.embeddings);
  const selectedId = useSelector(store, (store) => store.context.selectedId);
  const hovered = useSelector(store, (store) => store.context.hovered);
  const { scale } = useDebugControls({ center });
  useKeyboard();

  const worldRef = useRef<Group>(null!);

  const selectedEmbedding = useMemo(() => {
    return embeddings.find((e) => e.id === selectedId);
  }, [embeddings, selectedId]);

  const hoveredEmbedding = useMemo(() => {
    return embeddings.find((e) => e.id === hovered);
  }, [embeddings, hovered]);

  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = selectedEmbedding?.umap.map((x) => x * scale) ?? [];
    const neighbors = selectedEmbedding?.neighbors
      ?.map((neighbor) =>
        embeddings.find((embedding) => embedding.id === neighbor.id)
      )
      .map((embedding) => embedding?.umap.map((v) => v * scale) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [scale, embeddings, selectedEmbedding]);

  return (
    <group ref={worldRef}>
      {embeddings.map((embedding) => {
        const fade = !!(
          selectedId &&
          embedding.id !== selectedId &&
          !selectedEmbedding?.neighbors.map((n) => n.id).includes(embedding.id)
        );

        return (
          <ErrorBoundary fallback={null}>
            <Embed
              embedding={embedding}
              onClick={(embedding: Embedding | null) => {
                store.send({
                  type: "USER_CLICK_EMBEDDING",
                  payload: {
                    embeddingId: embedding?.id ?? null,
                  },
                });
              }}
              key={embedding.id}
              scale={scale}
              fade={fade}
            />
          </ErrorBoundary>
        );
      })}
      {hoveredEmbedding && (
        <Line
          key={`${selectedId}-hovered`}
          points={[
            currentPosition,
            hoveredEmbedding.umap.map((x) => x * scale) as UMAP,
          ]}
          color="white"
          lineWidth={2}
        />
      )}
      {!hoveredEmbedding &&
        neighborPositions?.map((neighborPosition, index) => {
          return (
            <Line
              key={`${selectedId}-${index}`}
              points={[currentPosition, neighborPosition]}
              color="white"
              lineWidth={2}
            />
          );
        })}
    </group>
  );
}

function useDebugControls({ center }: { center: () => void }) {
  const model = useSelector(store, (store) => store.context.model);
  const controls = useControls({
    scale: {
      value: SCALING_FACTOR,
      min: 0,
      step: 1,
    },
    model: {
      options: [
        "text-embedding-3-small",
        "text-embedding-3-large",
        "nomic-embed-text-v1.5",
        "mxbai-embed-large",
      ] as const satisfies EmbeddingModel[],
      value: model,
    },
    center: button(() => center()),
  });

  useEffect(() => {
    store.send({
      type: "EMBEDDING_MODEL_CHANGED",
      payload: { model: controls.model },
    });
  }, [controls.model]);

  return controls;
}

function useKeyboard() {
  const [isSearching, setIsSearched] = useState(false);
  useEffect(() => {
    const search = document.getElementById("search") as HTMLInputElement;
    search.addEventListener("focusin", () => {
      setIsSearched(true);
    });
    search.addEventListener("focusout", () => setIsSearched(false));
  }, []);
  const { camera } = useThree();
  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward
  );
  const backwardsPressed = useKeyboardControls<Controls>((state) => state.back);
  const V3 = useMemo(() => {
    return new Vector3();
  }, []);

  const SPEED = 10;

  useFrame(() => {
    const direction = camera.getWorldDirection(V3);
    if (forwardPressed && !isSearching) {
      camera.position.add(direction.multiplyScalar(SPEED));
    }
    if (backwardsPressed && !isSearching) {
      camera.position.sub(direction.multiplyScalar(SPEED));
    }
  });
}
