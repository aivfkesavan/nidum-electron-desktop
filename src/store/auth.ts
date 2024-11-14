import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type authState = {
  _id: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  _id: "",
  email: '',
  token: '',
  isLoggedIn: false,
}

const useAuthStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: payload => set({ ...payload }),
  clear: () => set({ ...payload }),
}),
  {
    name: 'user-storage'
  }
)))

export default useAuthStore
