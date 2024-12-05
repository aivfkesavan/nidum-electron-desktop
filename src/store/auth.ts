import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type authState = {
  _id: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
  isGoogleAuth: boolean;
  isOfflineLogin: boolean;
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
  isGoogleAuth: false,
  isOfflineLogin: false,
}

const useAuthStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: payload => set({ ...payload }),
  clear: () => set({ ...payload }),
}),
  {
    name: 'user-storage',
    version: 3,
    migrate: (persistedState: any, version) => {
      if (!version || version < 3) {
        return { ...payload }
      }
      return persistedState
    },
  }
)))

export default useAuthStore
