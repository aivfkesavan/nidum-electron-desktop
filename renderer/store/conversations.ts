import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Message = {
  id: string;
  role: "user" | "assistant" | "loading"
  content: string;
}

type Chat = {
  id: string;
  title: string;
  file_id: string | null
  rag_enabled: boolean
}

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  other: string
  systemPrompt: string;
  frequency_penalty: number;
  temperature: number;
  tokenLimit: number;
  max_tokens: number;
  top_p: number;
  n: number;
}

type FileT = {
  id: string
  name: string
  size: number
  type: string
}

type state = {
  projects: Record<string, Project>; // project_id
  files: Record<string, FileT[]>; // project_id
  chats: Record<string, Chat[]>; // project_id
  messages: Record<string, Message[]>; // chat_id
}

type addProjectType = {
  name: string;
  other: string;
  category: string;
  description: string;
  systemPrompt: string;
}

type actions = {
  addProject: (project: addProjectType) => void;
  editProject: (project_id: string, obj: Partial<Project>) => void;
  deleteProject: (project_id: string) => void;

  addChat: (projectId: string, chat: Chat) => void;
  editChat: (projectId: string, chat: Partial<Chat>) => void;
  deleteChat: (project_id: string, chat_id: string) => void;

  pushIntoMessages: (id: string, payload: Message | Message[]) => void
  deleteMessage: (chat_id: string, msg_id: string) => void;

  addFile: (projectId: string, file: FileT) => void;
  deleteFile: (project_id: string, file_id: string) => void;
}

const createDefaultProject = (): [string, Project] => {
  const id = nanoid(10);
  return [id, {
    id,
    name: "Default Project",
    description: "This is a default project",
    category: "General",
    other: "",
    systemPrompt: "You are a helpful assistant.",
    frequency_penalty: 0,
    temperature: 0.1,
    tokenLimit: 8000,
    max_tokens: 500,
    top_p: 1,
    n: 1,
  }];
}

const createDefaultChat = (projectId: string): Chat => ({
  id: nanoid(10),
  title: "Default Chat",
  file_id: null,
  rag_enabled: false,
})

const useConvoStore = create<state & actions>()(persist(immer(set => ({
  projects: {},
  chats: {},
  messages: {},
  files: {},

  addProject: (project) => set(state => {
    const id = nanoid(10)
    state.projects[id] = {
      id,
      ...project,
      tokenLimit: 8000,
      frequency_penalty: 0,
      temperature: 0.1,
      max_tokens: 500,
      top_p: 1,
      n: 1,
    }
  }),

  editProject: (project_id, details) => set(state => {
    state.projects[project_id] = Object.assign(state.projects[project_id], details)
  }),

  deleteProject: (project_id) => set(state => {
    const ids = state.chats[project_id]?.map(c => c.id) || []
    ids.forEach(id => {
      delete state.messages[id]
    })
    delete state.chats[project_id]
    delete state.files[project_id]
    delete state.projects[project_id]
  }),

  addChat: (projectId, chat) => set(state => {
    if (!state.chats[projectId]) {
      state.chats[projectId] = []
    }
    state.chats[projectId].unshift(chat)
  }),

  editChat: (projectId, chat) => set(state => {
    if (state.chats[projectId]) {
      const chatIndex = state.chats[projectId].findIndex(c => c.id === chat.id)
      if (chatIndex !== -1) {
        state.chats[projectId][chatIndex] = Object.assign(state.chats[projectId][chatIndex], chat)
      }
    }
  }),

  deleteChat: (project_id, chat_id) => set(state => {
    delete state.messages[chat_id]
    state.chats[project_id] = state.chats[project_id].filter(c => c.id !== chat_id)
  }),

  pushIntoMessages: (chat_id, msg) => set(state => {
    if (!state.messages[chat_id]) {
      state.messages[chat_id] = []
    }

    if (Array.isArray(msg)) {
      state.messages[chat_id].push(...msg)
    } else {
      state.messages[chat_id].push(msg)
    }
  }),

  deleteMessage: (chat_id, msg_id) => set(state => {
    state.messages[chat_id] = state.messages[chat_id].filter(msg => msg.id !== msg_id)
  }),

  addFile: (projectId, file) => set(state => {
    if (!state.files[projectId]) {
      state.files[projectId] = []
    }
    state.files[projectId].push(file)
  }),

  deleteFile: (project_id, file_id) => set(state => {
    state.files[project_id] = state.files[project_id].filter(c => c.id !== file_id)
  }),
})),
  {
    name: 'convo-storage',
    onRehydrateStorage: () => (state) => {
      if (state) {
        if (Object.keys(state.projects).length === 0) {
          const [defaultProjectId, defaultProject] = createDefaultProject();
          state.projects[defaultProjectId] = defaultProject;

          const defaultChat = createDefaultChat(defaultProjectId);
          state.chats[defaultProjectId] = [defaultChat];
          state.messages[defaultChat.id] = [];
        }
      }
    },
  }
))

export default useConvoStore;