import { customAlphabet } from 'nanoid';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'; // lowercase and digits only
const nanoid = customAlphabet(alphabet, 20);

type authState = {
  appId: string;
  isZrokSetuped: boolean
  isPublicShared: boolean
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  appId: nanoid(),
  isZrokSetuped: false,
  isPublicShared: false,
}

const useDeviceStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: (payload: Partial<authState>) => set({ ...payload }),
  clear: () => set({ ...payload }),
}),
  {
    name: 'device-storage'
  }
)))

export default useDeviceStore
