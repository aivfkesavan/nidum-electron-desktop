const fs = require("fs/promises")
const express = require('express')
const {
  OllamaEmbedding, Settings, Document,
  VectorStoreIndex, storageContextFromDefaults,
} = require("llamaindex")
require("dotenv/config")

const { queryIndex } = require("./query-doc")
const router = express.Router()

const INDEX_STORE_PATH = "./index_store"

router.post("/create-index", async (req, res) => {
  try {
    Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

    const essay = await fs.readFile(
      "node_modules/llamaindex/examples/abramov.txt",
      "utf-8",
    )

    const document = new Document({ text: essay, id_: "essay" })

    const storageContext = await storageContextFromDefaults({
      persistDir: INDEX_STORE_PATH,
    })

    const index = await VectorStoreIndex.fromDocuments([document], { storageContext })
    const stored = await index.storage.persist(INDEX_STORE_PATH)

    return res.json({ msg: "index stored", stored })

  } catch (error) {
    res.status(400).json({ error, msg: "m" })
  }
})

router.get("/ask", async (req, res) => {
  try {
    const { query } = req.query

    if (!query) return res.status(400).json({ error: "Query parameter is required" })

    const result = await queryIndex(query)

    return res.json(result)

  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
