import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { Embedding, SCALING_FACTOR, UMAP } from "../common/types";
import { EMBEDDINGS } from "../common/data";
import { Embed } from "./Embedding";

interface WorldProps {
  selected: Embedding | null;
  onClick: (embedding: Embedding | null) => void;
}

export function World({ selected, onClick }: WorldProps) {
  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = selected?.umap.map((x) => x * SCALING_FACTOR) ?? [];
    const neighbors = selected?.neighbors
      ?.map((id) => EMBEDDINGS.find((embedding) => embedding.id === id))
      .map((embedding) => embedding?.umap.map((v) => v * SCALING_FACTOR) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [selected]);

  return (
    <group>
      {EMBEDDINGS.map((embedding) => (
        <Embed
          embedding={embedding}
          selectedEmbedding={selected}
          onClick={onClick}
          key={embedding.id}
        />
      ))}
      {neighborPositions?.map((neighborPosition, index) => {
        return (
          <Line
            key={`${selected?.id}-${index}`}
            points={[currentPosition, neighborPosition]}
            color="black"
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}
