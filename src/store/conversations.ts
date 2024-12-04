import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import dayjs from 'dayjs';

import useAuthStore from './auth';
import { ragDefaultPrompt, systemDefaultPrompt, webDefaultPrompt } from '../utils/improve-context';
import { genMongoId } from '../utils';

export type Message = {
  id: string;
  role: "user" | "assistant" | "loading" | "web-searched"
  content: string;
  images?: string[];
  webSearched?: string[];
}

export type Chat = {
  id: string;
  title: string;
  at: string;
}

export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  other: string;
  systemPrompt: string;
  webPrompt: string;
  ragPrompt: string;
  frequency_penalty: number;
  temperature: number;
  max_tokens: number;
  top_p: number;
  n: number;
  web_enabled: boolean;
  rag_enabled: boolean;
  at: string;
}

type FileT = {
  id: string;
  name: string;
  size: number;
  type: string;
}

type state = {
  projects: Record<string, Project>; // project_id
  files: Record<string, FileT[]>; // project_id
  chats: Record<string, Chat[]>; // project_id
  messages: Record<string, Message[]>; // chat_id
}

type storeState = {
  data: Record<string, state>; // user_id
}

type addProjectType = {
  name: string;
  other: string;
  category: string;
  description: string;
  systemPrompt: string;
}

type actions = {
  init: () => void;
  addProject: (project: addProjectType) => void;
  editProject: (project_id: string, obj: Partial<Project>) => void;
  deleteProject: (project_id: string) => void;

  addChat: (projectId: string, chat: Omit<Chat, "at">) => void;
  editChat: (projectId: string, chat: Partial<Chat>) => void;
  deleteChat: (project_id: string, chat_id: string) => void;

  pushIntoMessages: (project_id: string, chat_id: string, payload: Message | Message[]) => void;
  deleteMessage: (chat_id: string, msg_id: string) => void;

  addFile: (projectId: string, file: FileT) => void;
  deleteFile: (project_id: string, file_id: string) => void;

  clearByUser: () => void
  clear: () => void;
}


const createDefaultProject = (): [string, Project] => {
  const id = genMongoId()
  return [id, {
    id,
    name: "Default Project",
    description: "This is a default project",
    category: "General",
    other: "",
    systemPrompt: systemDefaultPrompt,
    webPrompt: webDefaultPrompt,
    ragPrompt: ragDefaultPrompt,
    frequency_penalty: 0,
    temperature: 0.1,
    // tokenLimit: 6000,
    max_tokens: 500,
    top_p: 1,
    n: 1,
    web_enabled: false,
    rag_enabled: false,
    at: dayjs().toISOString(),
  }]
}

const createDefaultChat = (): Chat => ({
  id: genMongoId(),
  title: "Default Chat",
  at: dayjs().toISOString(),
})

const useConvoStore = create<storeState & actions>()(persist(immer(set => ({
  data: {},

  init: () => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]
    if (!state || Object.keys(state.projects)?.length === 0) {
      s.data[user_id] = {
        projects: {},
        chats: {},
        messages: {},
        files: {}
      }
      const [defaultProjectId, defaultProject] = createDefaultProject();
      s.data[user_id].projects = {
        [defaultProjectId]: defaultProject
      }

      const defaultChat = createDefaultChat();
      s.data[user_id].chats = {
        [defaultProjectId]: [defaultChat]
      }
      s.data[user_id].messages = {
        [defaultChat.id]: []
      }
    }
  }),

  addProject: (project) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    const id = genMongoId()
    state.projects[id] = {
      id,
      ...project,
      webPrompt: webDefaultPrompt,
      ragPrompt: ragDefaultPrompt,
      // tokenLimit: 6000,
      frequency_penalty: 0,
      temperature: 0.1,
      max_tokens: 500,
      top_p: 1,
      n: 1,
      web_enabled: false,
      rag_enabled: false,
      at: dayjs().toISOString(),
    }

    state.chats[id] = [{
      id: genMongoId(),
      title: "New Chat",
      at: dayjs().toISOString(),
    }]
  }),

  editProject: (project_id, details) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    // @ts-ignore
    state.projects[project_id] = Object.assign(state.projects[project_id], {
      ...details,
      at: dayjs().toISOString(),
    })
  }),

  deleteProject: (project_id) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    const ids = state.chats[project_id]?.map(c => c.id) || []
    ids.forEach(id => {
      delete state.messages[id]
    })
    delete state.chats[project_id]
    delete state.files[project_id]
    delete state.projects[project_id]
  }),

  addChat: (projectId, chat) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    // @ts-ignore
    state.projects[projectId].at = dayjs().toISOString()
    if (!state.chats[projectId]) {
      state.chats[projectId] = []
    }
    // @ts-ignore
    state.chats[projectId].unshift({
      ...chat,
      at: dayjs().toISOString(),
    })
  }),

  editChat: (projectId, chat) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    if (state.chats[projectId]) {
      // @ts-ignore
      state.projects[projectId].at = dayjs().toISOString()
      // @ts-ignore
      const chatIndex = state.chats[projectId].findIndex(c => c.id === chat.id)
      if (chatIndex !== -1) {
        // @ts-ignore
        state.chats[projectId][chatIndex] = Object.assign(state.chats[projectId][chatIndex], {
          ...chat,
          at: dayjs().toISOString(),
        })
      }
    }
  }),

  deleteChat: (project_id, chat_id) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    delete state.messages[chat_id]
    // @ts-ignore
    state.chats[project_id] = state.chats[project_id].filter(c => c.id !== chat_id)
  }),

  pushIntoMessages: (project_id, chat_id, msg) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    if (!state.messages[chat_id]) {
      state.messages[chat_id] = []
    }

    if (Array.isArray(msg)) {
      // @ts-ignore
      state.messages[chat_id].push(...msg)
    } else {
      // @ts-ignore
      state.messages[chat_id].push(msg)
    }

    // @ts-ignore
    state.projects[project_id].at = dayjs().toISOString()
    // @ts-ignore
    let chatIndex = state.chats[project_id].findIndex(c => c.id === chat_id)
    if (chatIndex > -1) {
      // @ts-ignore
      state.chats[project_id][chatIndex].at = dayjs().toISOString()
    }
  }),

  deleteMessage: (chat_id, msg_id) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    const messages = state.messages[chat_id] || []
    const targetIndex = messages.findIndex(msg => msg.id === msg_id)

    if (targetIndex === -1) return

    const targetMessage = messages[targetIndex]
    const toDelete = [targetIndex]

    if (targetMessage?.role === "user") {
      if (messages[targetIndex + 1]?.role === "web-searched") {
        toDelete.push(targetIndex + 1, targetIndex + 2)
      } else {
        toDelete.push(targetIndex + 1)
      }

    } else if (targetMessage?.role === "assistant") {
      if (messages[targetIndex - 1]?.role === "web-searched") {
        toDelete.push(targetIndex - 1, targetIndex - 2)
      } else {
        toDelete.push(targetIndex - 1)
      }
    }

    state.messages[chat_id] = messages.filter((msg, i) => !toDelete.includes(i))
  }),

  addFile: (projectId, file) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    if (!state.files[projectId]) {
      state.files[projectId] = []
    }
    // @ts-ignore
    state.files[projectId].push(file)
  }),

  deleteFile: (project_id, file_id) => set(s => {
    const user_id = useAuthStore.getState()._id
    let state = s.data[user_id]

    // @ts-ignore
    state.files[project_id] = state.files[project_id].filter(c => c.id !== file_id)
  }),

  clearByUser: () => set((state) => {
    const user_id = useAuthStore.getState()._id

    if (state.data[user_id]) {
      delete state.data[user_id]
    }
  }),

  clear: () => set({ data: {} }),
})),
  {
    name: 'convo-storage',
    version: 4,
    migrate: (persistedState: any, version) => {
      if (!version || version < 4) {
        return { data: {} }
      }
      return persistedState
    },
  }
))

export default useConvoStore;