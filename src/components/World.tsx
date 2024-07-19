import { Line } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo, useState } from "react";
import { EMBEDDINGS } from "../common/data";
import { Embedding, MODE, SCALING_FACTOR, UMAP } from "../common/types";
import { Embed } from "./Embedding";
import { dijkstra } from "../common/utils";

export function World() {
  const [selected, setSelected] = useState<Embedding | null>(null);
  const [secondSelection, setSecondSelection] = useState<Embedding | null>(
    null
  );
  const { scale, mode } = useControls({
    scale: {
      value: SCALING_FACTOR,
      min: 0,
      step: 1,
    },
    mode: {
      value: MODE.NEAREST_NEIGHBORS,
      min: 0,
      step: 1,
    },
  });

  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = selected?.umap.map((x) => x * scale) ?? [];
    const neighbors = selected?.neighbors
      ?.map((id) => EMBEDDINGS.find((embedding) => embedding.id === id))
      .map((embedding) => embedding?.umap.map((v) => v * scale) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [selected, scale]);

  const paths = useMemo(() => {
    if (!selected || !secondSelection) return [];
    const paths = dijkstra(EMBEDDINGS, selected?.id, secondSelection?.id);
    return (
      paths?.path.map((path) => [
        path.from.umap.map((x) => x * scale),
        path.to.umap.map((x) => x * scale),
      ]) ?? []
    );
  }, [selected, secondSelection, scale]);

  return (
    <group>
      {EMBEDDINGS.map((embedding) => {
        const fade =
          !!(
            mode === MODE.NEAREST_NEIGHBORS &&
            selected &&
            embedding.id !== selected?.id &&
            !selected?.neighbors.includes(embedding.id)
          ) ||
          !!(
            mode === MODE.PATH_EXPLORER &&
            selected &&
            embedding.id !== selected.id &&
            embedding.id !== secondSelection?.id
          );

        return (
          <Embed
            embedding={embedding}
            onClick={(embedding: Embedding | null) => {
              if (selected === embedding) {
                setSelected(null);
                setSecondSelection(null);
              } else if (selected && mode === MODE.PATH_EXPLORER) {
                setSecondSelection(embedding);
              } else {
                setSelected(embedding);
              }
            }}
            key={embedding.id}
            scale={scale}
            fade={fade}
          />
        );
      })}
      {mode === MODE.NEAREST_NEIGHBORS &&
        neighborPositions?.map((neighborPosition, index) => {
          return (
            <Line
              key={`${selected?.id}-${index}`}
              points={[currentPosition, neighborPosition]}
              color="black"
              lineWidth={1}
            />
          );
        })}

      {mode === MODE.PATH_EXPLORER &&
        secondSelection &&
        paths.map((path) => {
          // @ts-expect-error typing vector3s is annoying
          return <Line color="black" lineWidth={1} points={path} />;
        })}
    </group>
  );
}
