const {
  VectorStoreIndex,
  storageContextFromDefaults,
  Settings,
  OllamaEmbedding,
  VectorIndexRetriever
} = require("llamaindex");

const INDEX_STORE_PATH = "./index_store";

async function queryIndex(query) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

  const storageContext = await storageContextFromDefaults({
    persistDir: INDEX_STORE_PATH,
  })

  const loadedIndex = await VectorStoreIndex.init({ storageContext })

  const retriever = new VectorIndexRetriever({ similarityTopK: 6, index: loadedIndex })
  return await retriever.retrieve({ query })

  // const queryEngine = loadedIndex.asQueryEngine();
  // const data = await queryEngine.retriever.retrieve({ query })
  // const response = await queryEngine.query({ query });
}

module.exports = { queryIndex };