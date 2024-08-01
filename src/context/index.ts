import { Embedding, EmbeddingModel } from "@ksaldana1/embeddings_backend";
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

export type AppState = {
  selectedId: Embedding["id"] | null;
  embeddings: Embedding[];
  model: EmbeddingModel;
  hovered: Embedding["id"] | null;
};

export interface StoreEvent<T> {
  payload: T;
}

const store = createStoreWithProducer(
  produce,
  {
    selectedId: null,
    embeddings: [],
    model: "text-embedding-3-small",
    hovered: null,
  } as AppState,
  {
    USER_CLICK_EMBEDDING: (
      ctx,
      event: StoreEvent<{ embeddingId: string | null }>
    ) => {
      ctx.hovered = null;
      ctx.selectedId =
        ctx.selectedId === event.payload.embeddingId
          ? null
          : event.payload.embeddingId;
    },
    EMBEDDINGS_RECEIVED: (
      ctx,
      event: StoreEvent<{ embeddings: Embedding[] }>
    ) => {
      ctx.embeddings = event.payload.embeddings;
    },
    SIDEBAR_CLOSED: (ctx) => {
      ctx.selectedId = null;
      ctx.hovered = null;
    },
    EMBEDDING_MODEL_CHANGED: (
      ctx,
      event: StoreEvent<{ model: EmbeddingModel }>
    ) => {
      ctx.model = event.payload.model;
    },
    NEIGHBOR_HOVER_EVENT: (
      ctx,
      event: StoreEvent<{ embeddingId: string | null }>
    ) => {
      ctx.hovered = event.payload.embeddingId;
    },
  }
);

export default store;
