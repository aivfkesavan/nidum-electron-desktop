import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type llm_modelsT = "Local" | "Nidum Shared" | "Groq" | "Nidum" | "Hugging Face" | "SambaNova Systems" | "Anthropic" | "OpenAI";

type state = {
  project_id: string;
  chat_id: string;

  model_type: llm_modelsT
  llamaModel: string;
  llamaModeType: "" | "vision";
  sharedAppId: string;

  voice: string;

  stt_type: "Groq" | "System native";
  nativeSttModelsDownloaded: string;
  nativeSttModel: string;

  tts_type: "System native";
}

type actions = {
  updateContext: (v: Partial<state>) => void
  clear: () => void
}

const initPayload: state = {
  project_id: "",
  chat_id: "",

  model_type: "Local",
  llamaModel: "",
  llamaModeType: "",
  sharedAppId: "",

  voice: "Google UK English Female",

  stt_type: "System native",
  nativeSttModelsDownloaded: "",
  nativeSttModel: "",

  tts_type: "System native",
}

const useContextStore = create<state & actions>()(persist(set => ({
  ...initPayload,

  updateContext: val => set(val),
  clear: () => set({ ...initPayload }),
}),
  {
    version: 5,
    name: 'context-storage',
    migrate(persistedState: any, version) {
      if (!version || version < 5) {
        delete persistedState.groqApiKey
        delete persistedState.groqModel
        delete persistedState.hfApiKey
        delete persistedState.hfModel
        delete persistedState.sambaNovaApiKey
        delete persistedState.sambaNovaModel
        delete persistedState.anthropicApiKey
        delete persistedState.anthropicModel
        delete persistedState.openaiApiKey
        delete persistedState.openaiModel
        delete persistedState.sttGroqApiKey
        delete persistedState.hfImgGenModel
      }

      return persistedState
    },
  })
);

export default useContextStore;
