import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type FileT = {
  id: string;
  name: string;
  size: number;
  type: string;
}

type state = {
  files: Record<string, FileT[]>; // project_id
}

type actions = {
  addFile: (projectId: string, file: FileT) => void;
  deleteFile: (project_id: string, file_id: string) => void;

  clear: () => void
}

const initPayload = {
  files: {},
}

const useConvoStore = create<state & actions>()(persist(immer(set => ({
  ...initPayload,

  addFile: (projectId, file) => set(state => {
    if (!state.files[projectId]) {
      state.files[projectId] = []
    }
    // @ts-ignore
    state.files[projectId].push(file)
  }),

  deleteFile: (project_id, file_id) => set(state => {
    // @ts-ignore
    state.files[project_id] = state.files[project_id].filter(c => c.id !== file_id)
  }),

  clear: () => set({ ...initPayload }),
})),
  {
    name: 'convo-storage',
    version: 1,
  }
))

export default useConvoStore;