import { customAlphabet } from 'nanoid';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'; // lowercase and digits only
export const nanoid = customAlphabet(alphabet, 20);

type authState = {
  deviceId: string;
  isNidumSharedPublic: boolean
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  deviceId: nanoid(),
  isNidumSharedPublic: false,
}

const useDeviceStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: (payload: Partial<authState>) => set({ ...payload }),
  clear: () => set({ ...payload, deviceId: nanoid() }),
}),
  {
    name: 'device-storage',
    version: 5,
    migrate: (persistedState: any, version) => {
      if (!version || version < 5) {
        return { ...payload }
      }
      return persistedState
    },
  }
)))

export default useDeviceStore
