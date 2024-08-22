import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type state = {
  project_id: string;
  chat_id: string;

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
  nativeSttModelsDownloaded: "",
  nativeSttModel: "",
  sttGroqApiKey: "",

  tts_type: "System native",

  updateContext: val => set(val),
}),
  {
    name: 'context-storage',
  })
);

export default useContextStore;
