import express from 'express';
import duckduckgoSearch from 'duckduckgo-search';

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const text = req.query.text

    const results = []

    for await (const result of duckduckgoSearch.text(text)) {
      results.push(result)
    }

    return res.json(results?.filter((_, i) => i < 20))

  } catch (error) {
    res.status(500).send(error);
  }
})

export default router
