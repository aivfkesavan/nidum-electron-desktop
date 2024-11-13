import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { nanoid } from 'nanoid';

type authState = {
  appId: string;
}

type actions = {
  update: (v: Partial<authState>) => void
  clear: () => void
}

const payload = {
  appId: nanoid(10),
}

const useDeviceStore = create<authState & actions>()((persist((set) => ({
  ...payload,

  update: (payload: Partial<authState>) => set({ ...payload }),
  clear: () => set({ ...payload }),
}),
  {
    name: 'user-storage'
  }
)))

export default useDeviceStore
