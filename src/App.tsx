import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Scene } from "./components/Scene";
import { Embedding } from "./common/types";

function App() {
  const [selected, setSelected] = useState<Embedding | null>(null);
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div style={{ flex: 1 }}>
        <Canvas className="w-full h-full">
          <Scene selected={selected} onClick={setSelected} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
