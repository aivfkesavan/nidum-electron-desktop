import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type authState = {
  _id: string;
  name: string;
  email: string;
  token: string;
  isVerified: boolean;
  isLoggedIn: boolean;
  isOfflineLogin: boolean;
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  _id: "",
  name: "",
  email: '',
  token: '',
  isVerified: false,
  isLoggedIn: false,
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
      if (!version || version < 4) {
        return { ...payload }
      }
      return persistedState
    },
  }
)))

export default useAuthStore
