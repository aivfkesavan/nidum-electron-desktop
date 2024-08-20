import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type state = {
  is_downloading: boolean;
  name: string;
}

type actions = {
  updateContext: (v: Partial<state>) => void
}

const useModelStore = create<state & actions>()(persist(set => ({
  is_downloading: false,
  name: "",

  updateContext: val => set(val),
}),
  {
    name: 'model-storage',
  })
);

export default useModelStore;
