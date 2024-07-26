import { Line, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import {
  Controls,
  DistanceFn,
  Embedding,
  EmbeddingModel,
  SCALING_FACTOR,
  UMAP,
} from "../common/types";
import { useAppContext } from "../context/app";
import { Embed } from "./Embedding";

export function World({ center }: { center: () => void }) {
  const { state, dispatch } = useAppContext();
  const { scale, distanceFn } = useDebugControls({ center });
  useKeyboard();

  const embeddings = state.embeddings;

  const worldRef = useRef<Group>(null!);

  const selectedEmbedding = useMemo(() => {
    return state.embeddings.find((e) => e.id === state?.selectedId);
  }, [state.embeddings, state.selectedId]);

  const hoveredEmbedding = useMemo(() => {
    return state.embeddings.find((e) => e.id === state?.hovered);
  }, [state.embeddings, state.hovered]);

  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = selectedEmbedding?.umap.map((x) => x * scale) ?? [];
    const neighbors = selectedEmbedding?.neighbors
      .find((n) => n.distanceFn === distanceFn)
      ?.neighbors?.map((neighbor) =>
        embeddings.find((embedding) => embedding.id === neighbor.id)
      )
      .map((embedding) => embedding?.umap.map((v) => v * scale) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [scale, embeddings, selectedEmbedding, distanceFn]);

  return (
    <group ref={worldRef}>
      {embeddings.map((embedding) => {
        const fade = !!(
          state.selectedId &&
          embedding.id !== state.selectedId &&
          !selectedEmbedding?.neighbors
            .find((n) => n.distanceFn === distanceFn)
            ?.neighbors.map((n) => n.id)
            .includes(embedding.id)
        );

        return (
          <Embed
            embedding={embedding}
            onClick={(embedding: Embedding | null) => {
              dispatch({
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
        );
      })}
      {hoveredEmbedding && (
        <Line
          key={`${state.selectedId}-hovered`}
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
              key={`${state.selectedId}-${index}`}
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
  const { state, dispatch } = useAppContext();
  // const bounds = useBounds();
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
      value: state.model,
    },
    distanceFn: {
      options: [
        "Cosine",
        "L1",
        "L2",
        "Inner_Product",
      ] as const satisfies DistanceFn[],
      value: state.distanceFn,
    },
    center: button(() => center()),
  });

  // need to keep in sync with top level state
  // kinda annoying but this debug menu is very useful
  useEffect(() => {
    dispatch({
      type: "CHANGE_DISTANCE_FUNCTION",
      payload: { distanceFn: controls.distanceFn },
    });
  }, [controls.distanceFn, dispatch]);

  useEffect(() => {
    dispatch({
      type: "EMBEDDING_MODEL_CHANGED",
      payload: { model: controls.model },
    });
  }, [controls.model, dispatch]);

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
