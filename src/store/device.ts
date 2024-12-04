import { customAlphabet } from 'nanoid';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'; // lowercase and digits only
const nanoid = customAlphabet(alphabet, 20);

type authState = {
  deviceId: string;
  isNidumEnabled: boolean
  isNidumReserved: boolean
  isNidumUrlConfigured: boolean
  isNidumSharedPublic: boolean
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  deviceId: nanoid(),
  isNidumEnabled: false,
  isNidumReserved: false,
  isNidumUrlConfigured: false,
  isNidumSharedPublic: false,
}

const useDeviceStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: (payload: Partial<authState>) => set({ ...payload }),
  clear: () => set({ ...payload, deviceId: nanoid() }),
}),
  {
    name: 'device-storage',
    version: 4,
    migrate: (persistedState: any, version) => {
      if (!version || version < 4) {
        return { ...payload }
      }
      return persistedState
    },
  }
)))

export default useDeviceStore
