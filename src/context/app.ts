import { produce } from "immer";
import { createContext, Reducer, useContext } from "react";
import { match, P } from "ts-pattern";
import { Embedding } from "../common/types";

export type AppState = {
  selectedId: Embedding["id"] | null;
  embeddings: Embedding[];
  search: [number, number, number] | null;
};

export type AppEvents =
  | {
      type: "USER_CLICK_EMBEDDING";
      payload: { embeddingId: string | null };
    }
  | { type: "UPDATE_NEIGHBORS"; payload: { neighbors: string[]; id: string } }
  | { type: "EMBEDDINGS_RECEIVED"; payload: { embeddings: Embedding[] } }
  | { type: "SIDEBAR_CLOSED" };

export type AppContext = {
  state: AppState;
  dispatch: (event: AppEvents) => void;
};

export const Context = createContext<AppContext>(null!);

export const useAppContext = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("Could not find AppProvider in React tree.");
  }
  return ctx;
};

export const appReducer: Reducer<AppState, AppEvents> = (state, event) => {
  console.log(event);
  return match([state, event])
    .returnType<AppState>()
    .with([P.any, { type: "USER_CLICK_EMBEDDING" }], ([state, event]) => {
      return {
        ...state,
        selectedId:
          state.selectedId === event.payload.embeddingId
            ? null
            : event.payload.embeddingId,
      } as AppState;
    })
    .with([P.any, { type: "UPDATE_NEIGHBORS" }], ([state, event]) => {
      if (!state.selectedId) return state;
      return produce(state, (draftState) => {
        const embedding = draftState.embeddings.find(
          (e) => e.id === state?.selectedId
        )!;

        embedding.neighbors = event.payload.neighbors;
      });
    })
    .with([P.any, { type: "EMBEDDINGS_RECEIVED" }], ([state, event]) => {
      return {
        ...state,
        embeddings: event.payload.embeddings,
      };
    })
    .with([P.any, { type: "SIDEBAR_CLOSED" }], ([state]) => {
      return {
        ...state,
        selectedId: null,
      };
    })
    .exhaustive();
};
