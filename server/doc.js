const express = require('express')
const {
  OllamaEmbedding, Settings,
  VectorStoreIndex, storageContextFromDefaults, SimpleDirectoryReader,
} = require("llamaindex")
require("dotenv/config")

const { createPath, getRagPath } = require("./path-helper")
const { queryIndex } = require("./query-doc")
const { upload } = require("./add-files")

const router = express.Router()

router.post("/create-index/:folderName", upload.array('files'), async (req, res) => {
  try {
    const { folderName } = req.params
    Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

    const directoryPath = createPath([folderName])
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath })

    const persistDir = getRagPath(folderName)
    const storageContext = await storageContextFromDefaults({ persistDir })

    await VectorStoreIndex.fromDocuments(documents, { storageContext })

    return res.json({ msg: "index stored" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get("/ask", async (req, res) => {
  try {
    const { query } = req.query

    if (!query) return res.status(400).json({ error: "Query parameter is required" })

    const result = await queryIndex(query)

    return res.json(result)

  } catch (error) {
    return res.status(500).json({ error })
  }
})

module.exports = router
