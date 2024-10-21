import express from 'express';
import { getSublinks, crawlWebsite2 } from '../utils/crawler2';

const router = express.Router()

router.post("/get-links", async (req, res) => {
  try {
    const { url, excludedLinks, maxRequestsPerCrawl } = req.body

    const links = await getSublinks({ url, excludedLinks, maxRequestsPerCrawl })
    return res.json({ links })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

router.post("/crawle", async (req, res) => {
  try {
    const { urls, folderName } = req.body
    await crawlWebsite2({ urls, folderName })
    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router