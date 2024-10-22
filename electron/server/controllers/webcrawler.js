import express from 'express';
import fs from 'fs/promises';

import { getSublinks, crawlWebsite, convertUrlsToFilenames } from '../utils/crawler2';
import { indexFolder } from '../utils/llama';
import { createPath } from '../utils/path-helper';
import logger from '../utils/logger';

const router = express.Router()

router.get("/get-crawled-list/:folderName", async (req, res) => {
  try {
    const { folderName } = req.params
    const filePath = createPath(["crawled", `${folderName}.json`])

    try {
      const fileData = await fs.readFile(filePath, 'utf8')
      return res.json(JSON.parse(fileData))

    } catch (error) {
      return res.json([])
    }
  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/get-links", async (req, res) => {
  try {
    const { url, excludedLinks, maxRequestsPerCrawl } = req.body

    const links = await getSublinks({ url, excludedLinks, maxRequestsPerCrawl })
    return res.json({ links })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/crawle", async (req, res) => {
  try {
    const { urls, folderName } = req.body
    await crawlWebsite({ urls, folderName })

    await indexFolder({ folderName })

    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/delete", async (req, res) => {
  try {
    const { urls, folderName } = req.body

    for await (const url of urls) {
      const base = convertUrlsToFilenames(url) || "root"
      const fileParh = createPath([folderName, `${base}.txt`])
      try {
        await fs.unlink(fileParh)

      } catch (error) {
      }
    }

    const content = []
    const filePath = createPath(["crawled", `${folderName}.json`])

    try {

      const fileData = await fs.readFile(filePath, 'utf8');
      let data = JSON.parse(fileData)
      if (data && Array.isArray(data)) {
        content.push(...data)
      }
    } catch (err) {
      console.log("file is not exists", err)
    }

    let finalContents = content.filter(cont => !urls.includes(cont))
    await fs.writeFile(filePath, JSON.stringify(finalContents, null, 2), 'utf8');

    await indexFolder({ folderName })

    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

export default router