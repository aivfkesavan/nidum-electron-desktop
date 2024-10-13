import {
  Settings,
  HuggingFaceEmbedding,
  VectorStoreIndex,
  VectorIndexRetriever,
  SimpleDirectoryReader,
  storageContextFromDefaults,
} from "llamaindex";

import { getRagPath, createPath } from "./path-helper";

export async function indexFolder({ folderName }) {
  Settings.embedModel = new HuggingFaceEmbedding()

  const directoryPath = createPath([folderName])
  const documents = await new SimpleDirectoryReader().loadData({ directoryPath })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  await VectorStoreIndex.fromDocuments(documents, { storageContext })
}

export async function queryIndex(query, folderName) {
  Settings.embedModel = new HuggingFaceEmbedding()

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  const loadedIndex = await VectorStoreIndex.init({ storageContext })

  const retriever = new VectorIndexRetriever({ similarityTopK: 12, index: loadedIndex })
  return (await retriever.retrieve({ query }))?.map(doc => ({ text: doc?.node?.text, score: doc?.score }))
}
