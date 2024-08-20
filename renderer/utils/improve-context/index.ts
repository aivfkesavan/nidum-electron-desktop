export { default as duckDuckGoSerach } from "./duck-duck-go-search";
export { default as fileSearchQdrant } from "./file-search-qdrant";
export { default as ragSearch } from "./rag-search";

export const duckDuckGoPrompt = "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If the context does not contain the answer, then answer on your own. If the user asks a general question, you need to answer. "

export type prompt = {
  base?: string,
  context?: string
}

export function createContext({ base, context }: prompt) {
  const list = []

  if (base) list.push(base)

  if (context) list.push(
    "Context: --------- ",
    context,
    " ---------"
  )

  return list?.filter(Boolean)?.join("")
}