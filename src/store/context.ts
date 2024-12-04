import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import useAuthStore from './auth';

export type llm_modelsT =
  "Local" | "Nidum Shared" | "Nidum Decentralized" |
  "Groq" | "Hugging Face" | "SambaNova Systems" |
  "Anthropic" | "OpenAI" | "Ollama";

type state = {
  project_id: string;
  chat_id: string;

  model_type: llm_modelsT
  model_mode: "" | "vision";
  llamaModel: string;
  sharedAppId: string;
  ollamaUrl: string;
  ollamaModel: string;
  nidumDecentralisedModel: string;

  voice: string;

  stt_type: "Groq" | "System native";
  nativeSttModelsDownloaded: string;
  nativeSttModel: string;

  tts_type: "System native";
}

type storeState = {
  data: Record<string, state> // user_id
}

type actions = {
  init: () => void
  updateContext: (v: Partial<state>) => void
  clearByUser: () => void
  clear: () => void
}

const initPayload: state = {
  project_id: "",
  chat_id: "",

  model_type: "Local",
  model_mode: "",
  llamaModel: "",
  sharedAppId: "",
  ollamaUrl: "",
  ollamaModel: "",
  nidumDecentralisedModel: "",

  voice: "",

  stt_type: "System native",
  nativeSttModelsDownloaded: "",
  nativeSttModel: "",

  tts_type: "System native",
}

const useContextStore = create<storeState & actions>()(persist(immer(set => ({
  data: {},

  init: () => {
    const user_id = useAuthStore.getState()._id

    set((state) => {
      if (!state.data[user_id]) {
        state.data[user_id] = { ...initPayload }
      }
    })
  },

  updateContext: (val) => {
    const user_id = useAuthStore.getState()._id

    set((state) => {
      if (!state.data[user_id]) {
        state.data[user_id] = { ...initPayload }
      }
      state.data[user_id] = {
        ...state.data[user_id],
        ...val,
      };
    })
  },

  clearByUser: () => set((state) => {
    const user_id = useAuthStore.getState()._id

    if (state.data[user_id]) {
      delete state.data[user_id]
    }
  }),

  clear: () => set({ data: {} }),
})),
  {
    version: 9,
    name: 'context-storage',
    migrate(persistedState: any, version) {
      if (!version || version < 9) {
        return { data: {} }
      }

      return persistedState
    },
  })
)

export default useContextStore;
