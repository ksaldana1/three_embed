import { Line } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Embedding, MODE, SCALING_FACTOR, UMAP } from "../common/types";
import { dijkstra } from "../common/utils";
import { useAppContext } from "../context/app";
import { Embed } from "./Embedding";

export function World() {
  const { state, dispatch } = useAppContext();
  const embeddings = state.embeddings;
  const { scale, mode } = useControls({
    scale: {
      value: SCALING_FACTOR,
      min: 0,
      step: 1,
    },
    mode: {
      value: state.mode,
      min: 0,
      step: 1,
    },
  });

  // this kinda suckcs
  useEffect(() => {
    dispatch({ type: "SElECT_MODE", payload: { mode } });
  }, [mode, dispatch]);

  // these both can suck less
  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = state.selected?.umap.map((x) => x * scale) ?? [];
    const neighbors = state.selected?.neighbors
      ?.map((id) => embeddings.find((embedding) => embedding.id === id))
      .map((embedding) => embedding?.umap.map((v) => v * scale) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [state.selected, scale, embeddings]);

  const { points, paths } = useMemo(() => {
    if (
      state.mode === MODE.NEAREST_NEIGHBORS ||
      !state.selected ||
      !state.targetSelection
    )
      return { points: [], paths: [] };
    const paths = dijkstra(
      embeddings,
      state.selected?.id,
      state.targetSelection?.id
    );
    return {
      points:
        paths?.path.map((path) => [
          path.from.umap.map((x) => x * scale),
          path.to.umap.map((x) => x * scale),
        ]) ?? [],
      paths: paths?.path,
    };
  }, [state, scale, embeddings]);

  return (
    <group>
      {embeddings.map((embedding) => {
        const fade =
          !!(
            state.mode === MODE.NEAREST_NEIGHBORS &&
            state.selected &&
            embedding.id !== state.selected?.id &&
            !state.selected?.neighbors.includes(embedding.id)
          ) ||
          !!(
            state.mode === MODE.PATH_EXPLORER &&
            state.selected &&
            embedding.id !== state.selected.id &&
            embedding.id !== state.targetSelection?.id &&
            !paths?.find(
              (path) =>
                path?.from.id === embedding.id || path?.to.id === embedding.id
            )
          );

        return (
          <Embed
            embedding={embedding}
            onClick={(embedding: Embedding | null) => {
              dispatch({
                type: "USER_CLICK_EMBEDDING",
                payload: {
                  embedding,
                },
              });
            }}
            key={embedding.id}
            scale={scale}
            fade={fade}
          />
        );
      })}
      {state.mode === MODE.NEAREST_NEIGHBORS &&
        neighborPositions?.map((neighborPosition, index) => {
          return (
            <Line
              key={`${state.selected?.id}-${index}`}
              points={[currentPosition, neighborPosition]}
              color="black"
              lineWidth={1}
            />
          );
        })}

      {state.mode === MODE.PATH_EXPLORER &&
        state.targetSelection &&
        points.map((point, index) => {
          return (
            // @ts-expect-error typing vector3s is annoying
            <Line key={index} color="black" lineWidth={1} points={point} />
          );
        })}
    </group>
  );
}
