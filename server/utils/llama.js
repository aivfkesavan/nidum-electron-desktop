import {
  Settings,
  OllamaEmbedding,
  VectorStoreIndex,
  VectorIndexRetriever,
  SimpleDirectoryReader,
  storageContextFromDefaults,
} from "llamaindex";

import { getRagPath, createPath } from "./path-helper";

export async function indexFolder({ folderName }) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large", config: { host: "http://localhost:11490" } })

  const directoryPath = createPath([folderName])
  const documents = await new SimpleDirectoryReader().loadData({ directoryPath })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  await VectorStoreIndex.fromDocuments(documents, { storageContext })
}

export async function queryIndex(query, folderName) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large", config: { host: "http://localhost:11490" } })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  const loadedIndex = await VectorStoreIndex.init({ storageContext })

  const retriever = new VectorIndexRetriever({ similarityTopK: 12, index: loadedIndex })
  return (await retriever.retrieve({ query }))?.map(doc => ({ text: doc?.node?.text, score: doc?.score }))
}
