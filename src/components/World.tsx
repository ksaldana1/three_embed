import { Line, useBounds, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
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
import { useFrame, useThree } from "@react-three/fiber";

export function World() {
  const { state, dispatch } = useAppContext();
  useKeyboard();

  const bounds = useBounds();

  const embeddings = state.embeddings;
  const { scale, model, distanceFn } = useControls({
    scale: {
      value: SCALING_FACTOR,
      min: 0,
      step: 1,
    },
    model: {
      options: [
        "text-embedding-3-small",
        "text-embedding-3-large",
      ] as const satisfies EmbeddingModel[],
      value: "text-embedding-3-small" as const satisfies EmbeddingModel,
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
  });

  const modelToField =
    model === "text-embedding-3-small" ? "umap" : "umap_large";

  useEffect(() => {
    dispatch({ type: "CHANGE_DISTANCE_FUNCTION", payload: { distanceFn } });
  }, [distanceFn, dispatch]);

  const worldRef = useRef<Group>(null!);

  const selectedEmbedding = useMemo(() => {
    return state.embeddings.find((e) => e.id === state?.selectedId);
  }, [state.embeddings, state.selectedId]);

  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition =
      selectedEmbedding?.[modelToField].map((x) => x * scale) ?? [];
    const neighbors = selectedEmbedding?.neighbors
      .find((n) => n.distanceFn === distanceFn)
      ?.neighbors?.map((neighbor) =>
        embeddings.find((embedding) => embedding.id === neighbor.id)
      )
      .map(
        (embedding) => embedding?.[modelToField].map((v) => v * scale) ?? []
      );
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [scale, embeddings, selectedEmbedding, modelToField, distanceFn]);

  useLayoutEffect(() => {
    if (worldRef.current) {
      setTimeout(() => {
        bounds.refresh().clip().fit();
      }, 300);
    }
  }, [modelToField]);

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
            umap={modelToField}
          />
        );
      })}
      {neighborPositions?.map((neighborPosition, index) => {
        return (
          <Line
            dashed
            key={`${state.selectedId}-${index}`}
            points={[currentPosition, neighborPosition]}
            color="black"
            lineWidth={1}
          />
        );
      })}
    </group>
  );
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
  useFrame(() => {
    if (forwardPressed && !isSearching) {
      camera.position.z -= 10;
    }
    if (backwardsPressed && !isSearching) {
      camera.position.z += 10;
    }
  });
}
