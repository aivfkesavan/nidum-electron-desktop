import express from 'express';
import { promises as fs } from 'fs';

import { checkPathsSetup, getRoot } from '../utils/path-helper';

const router = express.Router()

router.post("/remove-files", async (req, res) => {
  try {
    const root = getRoot()
    await fs.rm(root, { recursive: true })

    checkPathsSetup()
    // const { includeModels } = req.body

    // const root = getRoot()
    // const keepList = []

    // if (!includeModels) {
    //   keepList.push(createPath(["models"]))
    // }

    // fs.readdir(root, (err, files) => {
    //   if (err) {
    //     console.error('Could not list the directory.', err)
    //     process.exit(1)
    //   }

    //   files.forEach((file) => {
    //     const filePath = createPath([file])
    //     console.log(filePath)

    //     if (keepList.includes(filePath)) {
    //       return
    //     }

    //     fs.stat(filePath, (err, stats) => {
    //       if (err) {
    //         console.error('Could not stat file.', err)
    //         return
    //       }

    //       // If it’s a directory, recursively delete it
    //       if (stats.isDirectory()) {
    //         console.log("is dir")
    //         fs.rm(filePath, { recursive: true, force: true }, (err) => {
    //           if (err) {
    //             console.error('Could not remove directory.', err)
    //           } else {
    //             console.log(`Deleted folder: ${filePath}`)
    //           }
    //         })
    //       } else {
    //         console.log("file")
    //         // If it’s a file, delete it
    //         fs.unlink(filePath, (err) => {
    //           if (err) {
    //             console.error('Could not delete file.', err)
    //           } else {
    //             console.log(`Deleted file: ${filePath}`)
    //           }
    //         })
    //       }
    //     })
    //   })
    // })

    res.json({ message: "files deleted successfully" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router