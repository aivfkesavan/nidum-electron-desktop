import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type state = {
  project_id: string;
  chat_id: string;

  webEnabled: boolean

  model_type: "Groq" | "Ollama" | "Nidum";
  groqApiKey: string;
  groqModel: string;
  ollamaUrl: string;
  ollamaModel: string;
  voice: string;

  embedding_type: "Ollama" | "Nidum";
  ollamEmbeddingUrl: string;
  ollamaEmbeddingModel: string;

  vb_type: "Qdrant" | "Nidum";
  qdrantDBUrl: string;
  qdrantDBApiKey: string;

  stt_type: "Groq" | "System native";
  sttGroqApiKey: string;

  tts_type: "System native";

  ragRetrieval: number;
}

type actions = {
  updateContext: (v: Partial<state>) => void
}

const useContextStore = create<state & actions>()(persist(set => ({
  project_id: "",
  chat_id: "",

  webEnabled: false,

  model_type: "Groq",
  groqApiKey: "",
  groqModel: "",
  ollamaUrl: "",
  ollamaModel: "",

  voice: "Google UK English Female",

  embedding_type: "Ollama",
  ollamEmbeddingUrl: "",
  ollamaEmbeddingModel: "",

  vb_type: "Qdrant",
  qdrantDBUrl: "",
  qdrantDBApiKey: "",

  stt_type: "System native",
  sttGroqApiKey: "",

  tts_type: "System native",

  ragRetrieval: 8,

  updateContext: val => set(val),
}),
  {
    name: 'context-storage',
    version: 1,
    migrate: (persistedState: any, version) => {
      if (version === 0) {
        return {
          ...persistedState,
          model_type: "Groq",
          embedding_type: "Ollama",
          vb_type: "Qdrant",
        }
      }

      return persistedState
    },
  })
);

export default useContextStore;
