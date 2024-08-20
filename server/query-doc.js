const {
  VectorStoreIndex,
  storageContextFromDefaults,
  Settings,
  OllamaEmbedding,
  VectorIndexRetriever
} = require("llamaindex");
const { getRagPath } = require("./path-helper");

async function queryIndex(query, folderName) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  const loadedIndex = await VectorStoreIndex.init({ storageContext })

  const retriever = new VectorIndexRetriever({ similarityTopK: 6, index: loadedIndex })
  return (await retriever.retrieve({ query }))?.map(doc => ({ text: doc?.node?.text, score: doc?.score }))

  // const queryEngine = loadedIndex.asQueryEngine();
  // const data = await queryEngine.retriever.retrieve({ query })
  // const response = await queryEngine.query({ query });
}

module.exports = { queryIndex };