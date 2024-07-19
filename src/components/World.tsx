import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { Embedding } from "../common/types";
import { EMBEDDINGS } from "../common/data";
import { Embed } from "./Embedding";

export const SCALING = 50;

interface WorldProps {
  selected: Embedding | null;
  onClick: (embedding: Embedding | null) => void;
}

export function World({ selected, onClick }: WorldProps) {
  const [currentPosition, neighbors] = useMemo(() => {
    const currentPosition = selected?.umap ?? [];
    const neighbors = selected?.neighbors
      ?.map((id) => EMBEDDINGS.find((embedding) => embedding.id === id))
      .map((embedding) => embedding?.umap.map((v) => v * SCALING) ?? []);
    return [
      currentPosition.map((x) => x * SCALING) as [number, number, number],
      neighbors as Array<[number, number, number]>,
    ];
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
      {neighbors?.map((neighbor) => {
        return (
          <Line
            points={[currentPosition, neighbor]}
            color="black"
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}
