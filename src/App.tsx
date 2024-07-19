import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";

function App() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex w-full h-full">
        <Canvas className="w-full h-full">
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
