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

  const b = useMemo(() => {
    if (!selected || !secondSelection) return [];
    return dijkstra(EMBEDDINGS, selected?.id, secondSelection?.id);
  }, [selected, secondSelection]);
  console.log(b);

  return (
    <group>
      {EMBEDDINGS.map((embedding) => (
        <Embed
          mode={mode}
          embedding={embedding}
          secondSelection={secondSelection}
          selectedEmbedding={selected}
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
        />
      ))}
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

      {mode === MODE.PATH_EXPLORER && secondSelection && (
        <Line
          color="black"
          lineWidth={1}
          points={[
            currentPosition,
            secondSelection?.umap.map((x) => x * scale) as UMAP,
          ]}
        />
      )}
    </group>
  );
}
