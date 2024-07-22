import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { client } from "./common/client";
import { Scene } from "./components/Scene";
import { AppProvider } from "./context/AppProvider";
import { useAppContext } from "./context/app";

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

type PromiseReturnType<T> = T extends Promise<infer R> ? R : never;

async function fetchSelectedEmbedding(id: string) {
  const { data } = await client
    .from("movies")
    .select("imdbID, Title, Director")
    .eq("imdbID", id);
  return data![0];
}

type SelectedType = PromiseReturnType<
  ReturnType<typeof fetchSelectedEmbedding>
>;

async function fetchNeighbors(id: string) {
  const { data } = await client.rpc("match_movies", { movieid: id, count: 5 });
  return data;
}

function Sidebar() {
  const { state, dispatch } = useAppContext();
  const [selectedData, setSelectedData] = useState<SelectedType | null>(null);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Escape") dispatch({ type: "SIDEBAR_CLOSED" });
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    if (state?.selected?.id) {
      fetchSelectedEmbedding(state.selected.id).then((data) =>
        setSelectedData(data)
      );
      fetchNeighbors(state?.selected?.id).then((data) => {
        dispatch({
          type: "UPDATE_NEIGHBORS",
          payload: {
            id: state.selected!.id,
            neighbors: data!.map((d) => d.imdbid),
          },
        });
      });
    }
  }, [state?.selected, dispatch]);
  const isOpen = !!state.selected;
  const { height } = useSpring({
    height: isOpen ? "75%" : "0%",
  });
  return (
    <animated.div
      style={{ height }}
      className={clsx(
        "absolute w-96 bg-blue-100 opacity-80 left-12 rounded-md shadow-lg"
      )}
    >
      {isOpen && selectedData ? (
        <Content
          neighbors={
            state.embeddings.find((e) => e.id === state?.selected?.id)
              ?.neighbors ?? []
          }
          embedding={selectedData}
        />
      ) : null}
    </animated.div>
  );
}

function Content({
  embedding,
  neighbors,
}: {
  embedding: SelectedType;
  neighbors: string[];
}) {
  const { state, dispatch } = useAppContext();
  return (
    <ul className="flex flex-col p-5 gap-3">
      <li>ID: {embedding.imdbID}</li>
      <li>Title: {embedding.Title}</li>
      <li>Director: {embedding.Director}</li>
      <div className="italic font-bold">Closest Neighbors</div>
      {neighbors.map((n) => (
        <li
          key={n}
          className="underline cursor-pointer"
          onClick={() => {
            dispatch({
              type: "USER_CLICK_EMBEDDING",
              payload: {
                embedding: state.embeddings.find((e) => e.id === n) ?? null,
              },
            });
          }}
        >
          {state.embeddings.find((e) => e.id === n)?.name}
        </li>
      ))}
    </ul>
  );
}

export default App;
