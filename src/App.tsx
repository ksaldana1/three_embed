import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stage,
  useTexture,
  Line,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import type { Mesh } from "three";
import EPISODES from "../public/episodes_en.json";
import "./App.css";

function App() {
  const [selected, setSelected] = useState<Episode | null>(null);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1 }}>
        <Canvas style={{ width: "100%", height: "100%" }}>
          <Stage>
            <OrbitControls makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
            <World
              selectedEp={selected}
              onTitleClick={(ep: Episode) => setSelected(ep)}
            />
          </Stage>
        </Canvas>
      </div>
    </div>
  );
}

export const SCALING = 50;

function World({
  onTitleClick,
  selectedEp,
}: {
  onTitleClick: (ep: Episode) => void;
  selectedEp: Episode | null;
}) {
  const [currentPosition, neighbors] = useMemo(() => {
    const currentPosition = selectedEp?.umap ?? [];
    const neighbors =
      selectedEp?.neighbors
        ?.map((id) => EPISODES.find((ep) => ep.episode === id))
        .map((ep) => [ep?.umap[0], ep?.umap[1], ep?.umap[2]]) ?? [];
    return [currentPosition, neighbors];
  }, [selectedEp]);
  return (
    <>
      {EPISODES.slice().map((ep) => (
        <EpisodeCube
          selectedEp={selectedEp}
          onClick={onTitleClick}
          key={ep.title}
          episode={ep}
        />
      ))}
      {neighbors?.map((n, k) => {
        return (
          <Line
            key={k}
            points={[
              // @ts-ignore
              currentPosition.map((x) => x * SCALING),
              // @ts-ignore
              n.map((x) => x * SCALING),
            ]} // Array of points to create the line
            color="black" // Line color
            lineWidth={1} // Line width
          />
        );
      })}
    </>
  );
}

export interface Episode {
  episode: number;
  title: string;
  year: number;
  url: string;
  summary: string;
  speakers: string;
  details: string;
  cover_img_url: string;
  neighbors: number[];
  hash: string;
  umap: number[];
}

function EpisodeCube({
  episode,
  onClick,
  selectedEp,
}: {
  episode: Episode;
  onClick: (ep: Episode) => void;
  selectedEp: Episode | null;
}) {
  const episodePrefix = String(episode.episode).padStart(3, "0");
  const texture = useTexture(`../imgs/${episodePrefix}.jpg`);
  const [x, y, z] = episode.umap;
  const ref = useRef<Mesh>(null!);

  return (
    <mesh
      ref={ref}
      onClick={() => onClick(episode)}
      position={[x * 50, y * 50, z * 50]}
    >
      <boxGeometry args={[10, 10, 1]} />
      <meshBasicMaterial
        transparent
        map={texture}
        opacity={
          episode === selectedEp ||
          !selectedEp ||
          selectedEp.neighbors.includes(episode.episode)
            ? 1
            : 0.2
        }
      />
    </mesh>
  );
}

export function Sidebar({
  episode,
  onClick,
}: {
  episode: Episode | null;
  onClick: () => void;
}) {
  const { width } = useSpring({ width: episode ? 512 : 0 });
  return (
    <animated.div
      onClick={onClick}
      style={{
        minWidth: width,
        height: "100%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box",
        display: episode ? "block" : "none",
      }}
    >
      <div>{episode?.title}</div>
      <div>{episode?.details}</div>
    </animated.div>
  );
}

export default App;
