import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ImgGenMsg = {
  id: string;
  role: "user" | "assistant" | "loading"
  content: string;
}

type state = {
  isLoading: boolean
  messages: Record<string, ImgGenMsg[]>
}

type actions = {
  upadateLoading: () => void;
  pushIntoMessages: (project_id: string, payload: ImgGenMsg | ImgGenMsg[]) => void;
  addBotMessages: (project_id: string, payload: ImgGenMsg) => void;
  deleteMessage: (project_id: string, id: string) => void;
  deleteLastProccess: (project_id: string) => void;
}

const useImgGenStore = create<state & actions>()(persist(immer(set => ({
  isLoading: false,
  messages: {},

  upadateLoading: () => set(state => {
    state.isLoading = !state.isLoading
  }),

  pushIntoMessages: (project_id, payload) => set(state => {
    if (!state.messages[project_id]) {
      state.messages[project_id] = []
    }
    if (Array.isArray(payload)) {
      state.messages[project_id].push(...payload)
    } else {
      state.messages[project_id].push(payload)
    }
  }),

  addBotMessages: (project_id, payload) => set(state => {
    state.messages[project_id] = state.messages[project_id].filter(m => m.role !== "loading")
    state.isLoading = !state.isLoading
    state.messages[project_id].push(payload)
  }),

  deleteMessage: (project_id, id) => set(state => {
    state.messages[project_id] = state.messages[project_id].filter(msg => msg.id !== id)
  }),

  deleteLastProccess: (project_id) => set(state => {
    state.messages[project_id].pop()
    state.messages[project_id].pop()
    state.isLoading = false
  }),

})),
  {
    name: 'img-gen-storage',
  }
))

export default useImgGenStore;