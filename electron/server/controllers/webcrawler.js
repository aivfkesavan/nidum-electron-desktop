import express from 'express';
import crawle from '../utils/crawler2';

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { url, maxRequestsPerCrawl, folderName } = req.body
    console.log({ url, maxRequestsPerCrawl, folderName })
    await crawle({ url, maxRequestsPerCrawl, folderName })
    return res.json({ msg: "Saved successfully" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router