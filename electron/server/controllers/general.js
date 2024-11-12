import express from 'express';
import ip from 'ip';

const router = express.Router()

router.get("/location", async (req, res) => {
  try {
    const ip_address = ip.address()
    return res.json({ ip_address })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
