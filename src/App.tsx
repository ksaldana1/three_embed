import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";

function App() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div style={{ flex: 1 }}>
        <Canvas className="w-full h-full">
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
