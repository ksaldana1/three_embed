import clsx from "clsx";
import Fuse, { FuseResult } from "fuse.js";
import { useMemo, useState } from "react";
import { Input, TextField } from "react-aria-components";
import { Embedding } from "../common/types";
import { useAppContext } from "../context/app";

export function Search() {
  const [search, setSearch] = useState<string | null>(null);
  const results = useFuse(search ?? null);
  const showResults = results && results.length && search && search.length >= 3;
  return (
    <div
      className="absolute z-10 bg-gray-800 text-gray-400 my-2 rounded-lg p-2 ms-2 pr-4 flex justify-center"
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace',
      }}
    >
      <TextField aria-label="search" className="flex gap-2 mx-3 mt-2 mb-1">
        <div>
          <Input
            aria-label="search_input"
            autoComplete="off"
            placeholder="Search..."
            className="border border-black caret-white p-1 bg-gray-700 capitalize mb-2"
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
          />
          <div
            className={clsx(
              "cursor-pointer gap-2 w-48",
              !showResults && "hidden py-2",
              showResults && "flex flex-col py-2 mt-1"
            )}
          >
            {showResults &&
              results
                .slice(0, 3)
                .map((result) => (
                  <Result result={result} setSearch={() => setSearch(null)} />
                ))}
          </div>
        </div>
      </TextField>
    </div>
  );
}

function Result({
  result,
  setSearch,
}: {
  result: FuseResult<Embedding>;
  setSearch: () => void;
}) {
  const { dispatch } = useAppContext();
  return (
    <div
      className="hover:bg-gray-400 hover:text-white rounded-lg pl-2"
      onClick={() => {
        dispatch({
          type: "USER_CLICK_EMBEDDING",
          payload: { embeddingId: result.item.id },
        });
        setSearch();
      }}
    >
      {result.item.name}
    </div>
  );
}

function useFuse(search: string | null) {
  const { state } = useAppContext();
  const fuse = useMemo(() => {
    return new Fuse(state.embeddings, {
      keys: ["name", "id"],
      includeScore: true,
      threshold: 0.2,
      ignoreLocation: true,
    });
  }, [state.embeddings]);
  if (!search) {
    return [];
  }
  return fuse.search(search);
}
