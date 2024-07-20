import { createContext, Reducer, useContext } from "react";
import { Embedding, MODE } from "../common/types";
import { match, P } from "ts-pattern";
import { produce } from "immer";

export type AppState =
  | {
      mode: MODE.NEAREST_NEIGHBORS;
      selected: Embedding | null;
      embeddings: Embedding[];
    }
  | {
      mode: MODE.PATH_EXPLORER;
      selected: Embedding | null;
      embeddings: Embedding[];
      targetSelection: Embedding | null;
    };

export type AppEvents =
  | {
      type: "USER_CLICK_EMBEDDING";
      payload: { embedding: Embedding | null };
    }
  | { type: "SElECT_MODE"; payload: { mode: MODE } }
  | { type: "UPDATE_NEIGHBORS"; payload: { neighbors: string[]; id: string } }
  | { type: "EMBEDDINGS_RECEIVED"; payload: { embeddings: Embedding[] } };

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
  return match([state, event])
    .returnType<AppState>()
    .with(
      [{ mode: MODE.NEAREST_NEIGHBORS }, { type: "USER_CLICK_EMBEDDING" }],
      ([state, event]) => {
        return {
          ...state,
          mode: MODE.NEAREST_NEIGHBORS,
          selected:
            state.selected === event.payload.embedding
              ? null
              : event.payload.embedding,
        } as AppState;
      }
    )
    .with(
      [{ mode: MODE.PATH_EXPLORER }, { type: "USER_CLICK_EMBEDDING" }],
      ([state, event]) => {
        return {
          ...state,
          mode: MODE.PATH_EXPLORER,
          selected:
            state.selected && state.selected === event.payload.embedding
              ? null
              : state.selected || event.payload.embedding,
          targetSelection:
            state.selected && state.selected !== event.payload.embedding
              ? event.payload.embedding
              : null,
        };
      }
    )
    .with([P.any, { type: "UPDATE_NEIGHBORS" }], ([state, event]) => {
      if (!state.selected) return state;
      return produce(state, (draftState) => {
        const embedding = draftState.embeddings.find(
          (e) => e.id === state?.selected?.id
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

    .with([P.any, { type: "SElECT_MODE" }], ([state, event]) => {
      return {
        ...state,
        mode: event.payload.mode,
        targetSelection: null,
      };
    })

    .run();
};
