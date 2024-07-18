import { Canvas } from "@react-three/fiber";
import {
  FontData,
  Stage,
  Text3D,
  CameraControls,
  useTexture,
  OrbitControls,
} from "@react-three/drei";
import { FrontSide } from "three";
import "./App.css";
import font from "../public/Roboto_regular.json";
import EPISODES from "../public/episodes.json";
import EPISODES_EN from "../public/episodes_en.json";
import { useControls } from "leva";

function App() {
  return (
    <div style={{ height: "100%" }}>
      <Canvas style={{ height: "100%" }}>
        <Stage>
          <OrbitControls />
          <World />
        </Stage>
      </Canvas>
    </div>
  );
}

function World() {
  const { cubes } = useControls({
    cubes: 10,
  });
  return (
    <>
      {EPISODES_EN.slice(0, cubes).map((ep) => (
        <EpisodeCube key={ep.title} episode={ep} />
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

function EpisodeText({ episode }: { episode: Episode }) {
  const [x, y, z] = episode.umap;
  return (
    <Text3D font={font as FontData} position={[x * 50, y * 50, z * 50]}>
      <meshBasicMaterial color="gray" />
      {episode.title}
    </Text3D>
  );
}

function EpisodeCube({ episode }: { episode: Episode }) {
  const episodePrefix = episode.episode <= 9 ? "00" : "0";
  const texture = useTexture(
    `../public/imgs/${episodePrefix}${episode.episode}.jpg`
  );
  const [x, y, z] = episode.umap;
  return (
    <mesh position={[x * 50, y * 50, z * 50]}>
      <boxGeometry args={[10, 10, 1]} />
      <meshBasicMaterial map={texture} side={FrontSide} />
    </mesh>
  );
}

export default App;
