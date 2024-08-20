const fs = require('fs').promises
const path = require('path')
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

async function indexFolder({ folderName }) {
  Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" })

  const directoryPath = createPath([folderName])
  const documents = await new SimpleDirectoryReader().loadData({ directoryPath })

  const persistDir = getRagPath(folderName)
  const storageContext = await storageContextFromDefaults({ persistDir })

  await VectorStoreIndex.fromDocuments(documents, { storageContext })
}

router.post("/index/:folderName", upload.array('files'), async (req, res) => {
  try {
    const { folderName } = req.params
    await indexFolder({ folderName })

    return res.json({ msg: "index stored" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete("/index/:folderName/:filename", async (req, res) => {
  try {
    const { folderName, filename } = req.params
    const filePath = createPath([folderName, filename])
    console.log(filePath)
    await fs.unlink(filePath)
    await indexFolder({ folderName })

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
