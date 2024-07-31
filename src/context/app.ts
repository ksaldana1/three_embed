import { createContext, Reducer, useContext } from "react";
import { match, P } from "ts-pattern";
import type { Embedding, EmbeddingModel } from "@ksaldana1/embeddings_backend";

export type AppState = {
  selectedId: Embedding["id"] | null;
  embeddings: Embedding[];
  search: string | null;
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
  console.log(event);
  return match([state, event])
    .returnType<AppState>()
    .with([P.any, { type: "USER_CLICK_EMBEDDING" }], ([state, event]) => {
      return {
        ...state,
        hovered: null,
        selectedId:
          state.selectedId === event.payload.embeddingId
            ? null
            : event.payload.embeddingId,
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
        hovered: null,
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
