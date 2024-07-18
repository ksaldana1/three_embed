import { Canvas } from "@react-three/fiber";
import "./App.css";
function App() {
  return (
    <div style={{ height: "100%" }}>
      <Canvas style={{ height: "100%" }}>
        <mesh>
          <meshBasicMaterial color="red" />
          <boxGeometry />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
