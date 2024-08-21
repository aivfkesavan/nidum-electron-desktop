const {
  Settings,
  OllamaEmbedding,
  VectorStoreIndex,
  VectorIndexRetriever,
  SimpleDirectoryReader,
  storageContextFromDefaults,
} = require("llamaindex");

const { getRagPath, createPath } = require("./path-helper");

async function indexFolder({ folderName }) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

  const directoryPath = createPath([folderName])
  const documents = await new SimpleDirectoryReader().loadData({ directoryPath })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  await VectorStoreIndex.fromDocuments(documents, { storageContext })
}

async function queryIndex(query, folderName) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  const loadedIndex = await VectorStoreIndex.init({ storageContext })

  const retriever = new VectorIndexRetriever({ similarityTopK: 6, index: loadedIndex })
  return (await retriever.retrieve({ query }))?.map(doc => ({ text: doc?.node?.text, score: doc?.score }))
}

module.exports = {
  indexFolder,
  queryIndex,
}