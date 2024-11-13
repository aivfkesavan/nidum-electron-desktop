import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type llm_modelsT = "Local" | "Groq" | "Nidum" | "Hugging Face" | "SambaNova Systems" | "Anthropic" | "OpenAI";

type state = {
  project_id: string;
  chat_id: string;

  model_type: llm_modelsT
  groqApiKey: string;
  groqModel: string;
  llamaModel: string;
  llamaModeType: "" | "vision";
  hfApiKey: string;
  hfModel: string;
  sambaNovaApiKey: string;
  sambaNovaModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
  openaiApiKey: string;
  openaiModel: string;

  hfImgGenModel: string;

  voice: string;

  stt_type: "Groq" | "System native";
  nativeSttModelsDownloaded: string;
  nativeSttModel: string;
  sttGroqApiKey: string;

  tts_type: "System native";
}

type actions = {
  updateContext: (v: Partial<state>) => void
}

const useContextStore = create<state & actions>()(persist(set => ({
  project_id: "",
  chat_id: "",

  model_type: "Local",
  groqApiKey: "",
  groqModel: "",
  llamaModel: "",
  llamaModeType: "",
  hfApiKey: "",
  hfModel: "",
  sambaNovaApiKey: "",
  sambaNovaModel: "",
  anthropicApiKey: "",
  anthropicModel: "",
  openaiApiKey: "",
  openaiModel: "",

  hfImgGenModel: "",

  voice: "Google UK English Female",

  stt_type: "System native",
  nativeSttModelsDownloaded: "",
  nativeSttModel: "",
  sttGroqApiKey: "",

  tts_type: "System native",

  updateContext: val => set(val),
}),
  {
    version: 3,
    name: 'context-storage',
    migrate(persistedState: any, version) {
      if (!version || version < 3) {
        persistedState.llamaModel = persistedState.ollamaModel
        persistedState.llamaModeType = persistedState.llamaModeType
        persistedState.model_type = persistedState.model_type === "Ollama" ? "Local" : persistedState.model_type

        delete persistedState.ollamaModel
        delete persistedState.ollamaModeType
        delete persistedState.ollamaUrl
        delete persistedState.embedding_type
        delete persistedState.ollamEmbeddingUrl
        delete persistedState.ollamaEmbeddingModel
        delete persistedState.vb_type
        delete persistedState.qdrantDBUrl
        delete persistedState.qdrantDBApiKey
      }

      return persistedState
    },
  })
);

export default useContextStore;
