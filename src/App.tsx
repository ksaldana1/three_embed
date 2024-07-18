import { Canvas } from "@react-three/fiber";
import { FontData, Stage, Text3D, CameraControls } from "@react-three/drei";
import "./App.css";
import font from "../public/Roboto_regular.json";
import EPISODES from "../public/episodes.json";
console.log(EPISODES);

function App() {
  return (
    <div style={{ height: "100%" }}>
      <Canvas style={{ height: "100%" }}>
        <Stage>
          <CameraControls />
          <World />
        </Stage>
      </Canvas>
    </div>
  );
}

function World() {
  return (
    <>
      {EPISODES.slice(0, 10).map((ep) => (
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

function EpisodeCube({ episode }: { episode: Episode }) {
  const [x, y, z] = episode.umap;
  return (
    <Text3D font={font as FontData} position={[x * 50, y * 50, z * 50]}>
      <meshBasicMaterial color="gray" />
      {episode.title}
    </Text3D>
  );
}

export default App;
