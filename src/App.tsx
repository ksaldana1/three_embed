import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Scene } from "./components/Scene";
import { Embedding } from "./common/types";

function App() {
  const [selected, setSelected] = useState<Embedding | null>(null);
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
          <Scene selected={selected} onClick={setSelected} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
