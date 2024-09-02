import express from 'express';
import { promises as fs } from 'fs';
import imageToBase64 from 'image-to-base64';

import { upload, uploadMemory } from "../middleawres/upload.js";
import { createPath } from "../utils/path-helper.js";
// import compressAndSave from '../utils/compress-img.js';

const router = express.Router()

router.get('/:folderName/:imageName', async (req, res) => {
  const { folderName, imageName } = req.params
  const imagePath = createPath([folderName, imageName])

  res.sendFile(imagePath, (err) => {
    if (err) return res.status(404).json({ msg: 'Image not found' })
  })
})

router.get('/to-base64/:folderName/:imageName', async (req, res) => {
  const { folderName, imageName } = req.params
  const imagePath = createPath([folderName, imageName])

  try {
    const converted = await imageToBase64(imagePath)
    return res.json({ converted })
  } catch (error) {
    return res.status(404).json({ msg: "cannot convert into base64" })
  }
})

router.post("/:folderName", upload.array('images'), async (req, res) => {
  try {
    // const { folderName } = req.params

    // await Promise.all(
    //   req.files.map(file => compressAndSave(file, folderName))
    // )

    return res.json({ msg: "image stored" })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
})

router.delete("/:folderName/:filename", async (req, res) => {
  try {
    const { folderName, filename } = req.params
    const filePath = createPath([folderName, filename])

    await fs.unlink(filePath)

    return res.json({ msg: "image deleted" })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
