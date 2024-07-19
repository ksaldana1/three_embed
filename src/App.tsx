import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { Scene } from "./components/Scene";
import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { AppProvider } from "./context/AppProvider";

function App() {
  return (
    <AppProvider>
      <div className="flex h-full w-full overflow-hidden items-center">
        <div className="flex w-full h-full">
          <Canvas className="w-full h-full">
            <Scene />
          </Canvas>
        </div>
        <Sidebar />
      </div>
    </AppProvider>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(false);
  const { height } = useSpring({
    height: open ? "75%" : "0%",
  });
  return (
    <animated.div
      onClick={() => setOpen((s) => !s)}
      style={{ height }}
      className={clsx("absolute w-96 bg-green-500 left-12")}
    >
      {open ? "Sidebar" : null}
    </animated.div>
  );
}

export default App;
