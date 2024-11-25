
export type Message = {
  id: string;
  _id?: string;
  role: "user" | "assistant" | "loading" | "web-searched"
  content: string;
  images?: string[];
  webSearched?: string[]
}

export type Chat = {
  _id: string;
  title: string;
  updatedAt: string;
}

export type Project = {
  _id: string;
  name: string;
  description: string;
  category: string;
  other: string
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
  updatedAt: string;
}
