import { createContext, Reducer, useContext } from "react";
import { Embedding, MODE } from "../common/types";
import { match } from "ts-pattern";

export type AppState =
  | { mode: MODE.NEAREST_NEIGHBORS; selected: Embedding | null }
  | {
      mode: MODE.PATH_EXPLORER;
      selected: Embedding | null;
      targetSelection: Embedding | null;
    };

export type AppEvents = {
  type: "USER_CLICK_EMBEDDING";
  payload: { embedding: Embedding | null };
};

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
              : event.payload.embedding,
          targetSelection:
            state.selected && state.selected !== event.payload.embedding
              ? event.payload.embedding
              : null,
        } as AppState;
      }
    )
    .run();
};
