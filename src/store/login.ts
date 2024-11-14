import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type payload = {
  _id: string;
  email: string;
  token: string;
  password: string;
}

type state = {
  data: payload[]
}

type actions = {
  update: (v: payload) => void
  clear: () => void
}

const useLoginStore = create<state & actions>()((persist((set, get) => ({
  data: [],

  update: payload => {
    let data = [...get().data]

    if (data?.some(d => d.email === payload.email)) {
      data = data.map(d => {
        if (d.email === payload.email) {
          return {
            ...d,
            ...payload
          }
        }

        return d
      })
    } else {
      data.push(payload)
    }

    set({ data })
  },
  clear: () => set({ data: [] }),
}),
  {
    name: 'login-storage'
  }
)))

export default useLoginStore
