import Fuse, { FuseResult } from "fuse.js";
import { useMemo, useState } from "react";
import { Input, Label, TextField } from "react-aria-components";
import { Embedding } from "../common/types";
import { useAppContext } from "../context/app";

export function Search() {
  const [search, setSearch] = useState<string | null>(null);
  const results = useFuse(search ?? null);
  return (
    <div
      className="absolute z-10 bg-gray-800 text-gray-400 mt-2 rounded-lg p-2 ms-2 pr-4 flex justify-center"
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace',
      }}
    >
      <TextField className="flex gap-2 ml-3 mt-2">
        <Label className="mt-1">Search</Label>
        <div>
          <Input
            className="border border-black caret-white p-1 bg-gray-700"
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
          />
          <div className="cursor-pointer flex flex-col gap-1 mt-1">
            {results &&
              results.length <= 3 &&
              results.map((result) => (
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
      className="hover:bg-blue-100"
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
      keys: ["name"],
      includeScore: true,
      threshold: 0.2,
    });
  }, [state.embeddings]);
  if (!search) {
    return [];
  }
  return fuse.search(search);
}
