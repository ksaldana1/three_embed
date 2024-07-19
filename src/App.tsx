import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { animated, useSpring } from "react-spring";
import { Scene } from "./components/Scene";
import { AppProvider } from "./context/AppProvider";
import { useAppContext } from "./context/app";
import { Embedding } from "./common/types";

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
  const { state } = useAppContext();
  const isOpen = state.selected;
  const { height } = useSpring({
    height: isOpen ? "75%" : "0%",
  });
  return (
    <animated.div
      style={{ height }}
      className={clsx(
        "absolute w-96  bg-blue-100 opacity-75 left-12 rounded-md"
      )}
    >
      {isOpen && state.selected ? <Content embedding={state.selected} /> : null}
    </animated.div>
  );
}

function Content({ embedding }: { embedding: Embedding }) {
  return (
    <ul className="flex flex-col p-5 gap-3">
      <li>ID: {embedding.id}</li>
      <li>
        UMAP:{" "}
        {embedding.umap.map((x) => (
          <span className="mx-4">{x.toFixed(2)}</span>
        ))}
      </li>
    </ul>
  );
}

export default App;
