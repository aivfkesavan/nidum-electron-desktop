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
  messages: ImgGenMsg[]
}

type actions = {
  pushIntoMessages: (payload: ImgGenMsg | ImgGenMsg[]) => void;
  addBotMessages: (payload: ImgGenMsg) => void;
  upadateLoading: () => void;
  deleteMessage: (id: string) => void;
  deleteLastProccess: () => void;
}

const useImgGenStore = create<state & actions>()(persist(immer(set => ({
  isLoading: false,
  messages: [],

  pushIntoMessages: (payload) => set(state => {
    if (Array.isArray(payload)) {
      state.messages.push(...payload)
    } else {
      state.messages.push(payload)
    }
  }),

  addBotMessages: (payload) => set(state => {
    state.messages = state.messages.filter(m => m.role !== "loading")
    state.isLoading = !state.isLoading
    state.messages.push(payload)
  }),

  upadateLoading: () => set(state => {
    state.isLoading = !state.isLoading
  }),

  deleteMessage: (id) => set(state => {
    state.messages = state.messages.filter(msg => msg.id !== id)
  }),

  deleteLastProccess: () => set(state => {
    state.messages.pop()
    state.messages.pop()
    state.isLoading = false
  }),

})),
  {
    name: 'img-gen-storage',
  }
))

export default useImgGenStore;