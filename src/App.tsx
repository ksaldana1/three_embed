import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stage,
  useTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { useState } from "react";
import { animated, useSpring } from "react-spring";
import EPISODES from "../public/episodes.json";
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
      <Sidebar
        onClick={() => {
          if (selected) setSelected(null);
        }}
        episode={selected}
      />
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

function World({
  onTitleClick,
  selectedEp,
}: {
  onTitleClick: (ep: Episode) => void;
  selectedEp: Episode | null;
}) {
  const { cubes } = useControls({
    cubes: 100,
  });
  return (
    <>
      {EPISODES.slice(0, cubes).map((ep) => (
        <EpisodeCube
          isSelected={ep === selectedEp}
          onClick={onTitleClick}
          key={ep.title}
          episode={ep}
        />
      ))}
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
  hash: string;
  umap: number[];
}

function EpisodeCube({
  episode,
  onClick,
  isSelected,
}: {
  episode: Episode;
  onClick: (ep: Episode) => void;
  isSelected: boolean;
}) {
  const episodePrefix = String(episode.episode).padStart(3, "0");
  const texture = useTexture(`../public/imgs/${episodePrefix}.jpg`);
  const [x, y, z] = episode.umap;
  return (
    <mesh onClick={() => onClick(episode)} position={[x * 50, y * 50, z * 50]}>
      <boxGeometry args={[10, 10, 1]} />
      <meshBasicMaterial
        transparent
        map={texture}
        opacity={isSelected ? 1 : 0.2}
      />
    </mesh>
  );
}

function Sidebar({
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
