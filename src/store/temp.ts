import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Message } from './conversations';

type state = {
  loading: boolean
  data: Message[]
}

type storeState = {
  data: Record<string, state>; // chat_id
}

type actions = {
  setLoading: (chat_id: string, v: boolean) => void
  setTempData: (chat_id: string, v: Message[] | ((v: Message[]) => Message[])) => void
  reset: (chat_id: string) => void
}

const useTempStore = create<storeState & actions>()(immer(set => ({
  data: {},

  setLoading: (chat_id, loading) => set(s => {
    if (!s.data[chat_id]) {
      s.data[chat_id] = {
        loading: false,
        data: [],
      }
    }
    s.data[chat_id].loading = loading
  }),

  setTempData: (chat_id, dataOrUpdater) => set(s => {
    if (!s.data[chat_id]) {
      s.data[chat_id] = {
        loading: false,
        data: [],
      }
    }

    if (typeof dataOrUpdater === 'function') {
      s.data[chat_id].data = dataOrUpdater(s.data[chat_id].data)

    } else {
      s.data[chat_id].data = dataOrUpdater
    }
  }),

  reset: (chat_id) => set(s => {
    s.data[chat_id] = {
      loading: false,
      data: [],
    }
  }),
})))

export default useTempStore
