import { Canvas } from "@react-three/fiber";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import QueryClient from "./common/query";
import { Scene } from "./components/Scene";
import { Search } from "./components/Search";
import { Stars } from "@react-three/drei";
import store from "./context";
import { useSelector } from "@xstate/store/react";
import type { Embedding, EmbeddingModel } from "@ksaldana1/embeddings_backend";
import { fetchEmbeddings } from "./common/data";

function App() {
  return (
    <QueryClientProvider client={QueryClient}>
      <EmbeddingProvider>
        <Search />
        <div className="flex h-full w-full overflow-hidden items-center">
          <div className="flex w-full h-full">
            <Canvas className="w-full h-full bg-black">
              <Stars
                radius={10000}
                depth={50}
                count={10000}
                factor={1}
                saturation={1}
              />
              <Scene />
            </Canvas>
          </div>
          <Sidebar />
        </div>
      </EmbeddingProvider>
    </QueryClientProvider>
  );
}

function EmbeddingProvider({ children }: { children: React.ReactNode }) {
  const model = useSelector(store, (store) => store.context.model);
  const { data } = useQuery({
    queryKey: ["embeddings", model],
    queryFn: ({ queryKey }) => {
      return fetchEmbeddings(queryKey.at(-1) as EmbeddingModel);
    },
  });

  useEffect(() => {
    if (data) {
      store.send({
        type: "EMBEDDINGS_RECEIVED",
        payload: { embeddings: data },
      });
    }
  }, [data]);

  return <>{children}</>;
}

function Sidebar() {
  const selectedId = useSelector(store, (state) => state.context.selectedId);
  const embeddings = useSelector(store, (state) => state.context.embeddings);
  const [showContent, setShowContent] = useState(false);

  const selectedEmbedding = embeddings.find((e) => e.id === selectedId);

  const isOpen = !!selectedId;
  const { minHeight } = useSpring({
    minHeight: isOpen ? "50%" : "0%",
    onRest: () => {
      setShowContent((s) => !s);
    },
    config: config.stiff,
  });

  return (
    <animated.div
      style={{ minHeight }}
      className="absolute w-96 left-12 rounded-lg shadow-lg select-none bg-gray-800 opacity-90"
    >
      {isOpen && !!selectedId && showContent && selectedEmbedding ? (
        <Content embedding={selectedEmbedding} />
      ) : null}
    </animated.div>
  );
}

function Content({ embedding }: { embedding: Embedding }) {
  const embeddings = useSelector(store, (state) => state.context.embeddings);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Escape") store.send({ type: "SIDEBAR_CLOSED" });
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <ul
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace',
      }}
      className="flex flex-col p-5 gap-1 text-sm select-none"
    >
      <Item
        item={embedding.name}
        label={
          <div className="flex items-center gap-3">
            <div>Title</div>
            <div className="mb-0.5">
              <Link href={`https://www.imdb.com/title/${embedding.id}/`} />
            </div>
          </div>
        }
      />
      <Item item={embedding.director} label="Director" />
      <div className="italic text-gray-400">Neighbors</div>
      {embedding.neighbors.map((n) => (
        <li
          key={n.id}
          className="flex justify-between"
          onClick={() => {
            store.send({
              type: "USER_CLICK_EMBEDDING",
              payload: {
                embeddingId: n.id,
              },
            });
          }}
        >
          <div
            onPointerEnter={() => {
              store.send({
                type: "NEIGHBOR_HOVER_EVENT",
                payload: { embeddingId: n.id },
              });
            }}
            onPointerLeave={() => {
              store.send({
                type: "NEIGHBOR_HOVER_EVENT",
                payload: { embeddingId: null },
              });
            }}
            className="cursor-pointer underline text-gray-400"
          >
            {embeddings.find((e) => e.id === n.id)?.name}
          </div>
          <div className="ms-4 text-gray-400">{n.distance.toFixed(4)}</div>
        </li>
      ))}
    </ul>
  );
}

function Link({ href }: { href: string }) {
  return (
    <a href={href} target="_blank">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="18"
        height="18"
        viewBox="0 0 50 50"
        fill="white"
      >
        <path d="M 33.40625 0 C 32.855469 0.0507813 32.449219 0.542969 32.5 1.09375 C 32.550781 1.644531 33.042969 2.050781 33.59375 2 L 46.5625 2 L 25.6875 22.90625 C 25.390625 23.148438 25.253906 23.535156 25.339844 23.910156 C 25.425781 24.28125 25.71875 24.574219 26.089844 24.660156 C 26.464844 24.746094 26.851563 24.609375 27.09375 24.3125 L 48 3.4375 L 48 16.40625 C 47.996094 16.765625 48.183594 17.101563 48.496094 17.285156 C 48.808594 17.464844 49.191406 17.464844 49.503906 17.285156 C 49.816406 17.101563 50.003906 16.765625 50 16.40625 L 50 0 L 33.59375 0 C 33.5625 0 33.53125 0 33.5 0 C 33.46875 0 33.4375 0 33.40625 0 Z M 2 10 C 1.476563 10 0.941406 10.183594 0.5625 10.5625 C 0.183594 10.941406 0 11.476563 0 12 L 0 48 C 0 48.523438 0.183594 49.058594 0.5625 49.4375 C 0.941406 49.816406 1.476563 50 2 50 L 38 50 C 38.523438 50 39.058594 49.816406 39.4375 49.4375 C 39.816406 49.058594 40 48.523438 40 48 L 40 18 C 40.003906 17.640625 39.816406 17.304688 39.503906 17.121094 C 39.191406 16.941406 38.808594 16.941406 38.496094 17.121094 C 38.183594 17.304688 37.996094 17.640625 38 18 L 38 48 L 2 48 L 2 12 L 32 12 C 32.359375 12.003906 32.695313 11.816406 32.878906 11.503906 C 33.058594 11.191406 33.058594 10.808594 32.878906 10.496094 C 32.695313 10.183594 32.359375 9.996094 32 10 Z"></path>
      </svg>
    </a>
  );
}

function Item({ item, label }: { item: string; label: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-4 select-none">
      <label className="text-gray-400 text-sm mb-1 w-36">{label}</label>
      <div className="w-full bg-gray-700 text-white p-2 rounded">{item}</div>
    </div>
  );
}

export default App;
