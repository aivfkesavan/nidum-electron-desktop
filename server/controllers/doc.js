const express = require('express')
const fs = require('fs').promises
require("dotenv/config")

const { queryIndex, indexFolder } = require("../utils/llama")
const { createPath, getRagPath } = require("../utils/path-helper")
const { upload } = require("../middleawres/upload")

const router = express.Router()

router.get("/:folderName", async (req, res) => {
  try {
    const { folderName } = req.params
    const { query } = req.query

    if (!query) return res.status(400).json({ error: "Query parameter is required" })

    const result = await queryIndex(query, folderName)

    return res.json(result)

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/:folderName", upload.array('files'), async (req, res) => {
  try {
    const { folderName } = req.params
    await indexFolder({ folderName })

    return res.json({ msg: "index stored" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete("/:folderName/:filename", async (req, res) => {
  try {
    const { folderName, filename } = req.params
    const filePath = createPath([folderName, filename])

    await fs.unlink(filePath)

    const indexStore = getRagPath(folderName)
    await fs.rm(indexStore, { recursive: true, force: true })

    await indexFolder({ folderName })

    return res.json({ msg: "index stored" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router