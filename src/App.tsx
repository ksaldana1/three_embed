import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { Embedding } from "./common/types";
import { Scene } from "./components/Scene";
import { AppProvider } from "./context/AppProvider";
import { useAppContext } from "./context/app";
import { Search } from "./components/Search";

function App() {
  return (
    <AppProvider>
      <Search />
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

  const selectedEmbedding = state.embeddings.find(
    (e) => e.id === state.selectedId
  );

  const isOpen = !!state.selectedId;
  const { minHeight } = useSpring({
    minHeight: isOpen ? "50%" : "0%",
  });
  return (
    <animated.div
      style={{ minHeight }}
      className={clsx(
        "absolute w-96 bg-blue-100 opacity-80 left-12 rounded-md shadow-lg"
      )}
    >
      {isOpen && !!state.selectedId ? (
        <Content embedding={selectedEmbedding as Movie} />
      ) : null}
    </animated.div>
  );
}

interface Movie extends Embedding {
  imdbID: string;
  Title: string;
  Director: string;
}

function Content({ embedding }: { embedding: Movie }) {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Escape") dispatch({ type: "SIDEBAR_CLOSED" });
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <ul className="flex flex-col p-5 gap-3">
      <li>ID: {embedding.imdbID}</li>
      <li>Title: {embedding.Title}</li>
      <li>Director: {embedding.Director}</li>
      <div className="italic font-bold">Closest Neighbors</div>
      {embedding
        .neighbors!.find((n) => n.distanceFn === state.distanceFn)
        ?.neighbors.map((n) => (
          <li
            key={n.id}
            onClick={() => {
              dispatch({
                type: "USER_CLICK_EMBEDDING",
                payload: {
                  embeddingId: n.id,
                },
              });
            }}
          >
            <span className="cursor-pointer underline">
              {state.embeddings.find((e) => e.id === n.id)?.name}
            </span>
            <span className="ms-4">{n.distance.toFixed(4)}</span>
          </li>
        ))}
    </ul>
  );
}

export default App;
