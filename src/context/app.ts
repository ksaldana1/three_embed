import { createContext, Reducer, useContext } from "react";
import { match, P } from "ts-pattern";
import { DistanceFn, Embedding, EmbeddingModel } from "../common/types";

export type AppState = {
  selectedId: Embedding["id"] | null;
  embeddings: Embedding[];
  search: [number, number, number] | null;
  distanceFn: DistanceFn;
  model: EmbeddingModel;
  hovered: Embedding["id"] | null;
};

export type AppEvents =
  | {
      type: "USER_CLICK_EMBEDDING";
      payload: { embeddingId: string | null };
    }
  | { type: "EMBEDDINGS_RECEIVED"; payload: { embeddings: Embedding[] } }
  | { type: "SIDEBAR_CLOSED" }
  | { type: "CHANGE_DISTANCE_FUNCTION"; payload: { distanceFn: DistanceFn } }
  | { type: "EMBEDDING_MODEL_CHANGED"; payload: { model: EmbeddingModel } }
  | { type: "NEIGHBOR_HOVER_EVENT"; payload: { embeddingId: string | null } };

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
    .with([P.any, { type: "USER_CLICK_EMBEDDING" }], ([state, event]) => {
      return {
        ...state,
        selectedId:
          state.selectedId === event.payload.embeddingId
            ? null
            : event.payload.embeddingId,
      } as AppState;
    })
    .with([P.any, { type: "CHANGE_DISTANCE_FUNCTION" }], ([state, event]) => {
      return {
        ...state,
        distanceFn: event.payload.distanceFn,
      };
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
    .with([P.any, { type: "EMBEDDING_MODEL_CHANGED" }], ([state, event]) => {
      return {
        ...state,
        model: event.payload.model,
      };
    })
    .with([P.any, { type: "NEIGHBOR_HOVER_EVENT" }], ([state, event]) => {
      return {
        ...state,
        hovered: event.payload.embeddingId,
      };
    })

    .exhaustive();
};
