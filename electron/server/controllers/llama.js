import { resolveModelFile } from "node-llama-cpp";
import { promises as fs } from 'fs';
import express from 'express';

import { readJSON, updateJSONArr } from "../utils/json-helper";
import { createPath } from '../utils/path-helper';
import { upload } from "../middleawres/upload";

const router = express.Router()

router.get("/model-path/:selectedModel", async (req, res) => {
  try {
    const { selectedModel } = req.params

    const modelPath = createPath(["models", selectedModel])
    return res.json({ modelPath })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.get("/models/:type", async (req, res) => {
  try {
    const { type } = req.params
    const modelJson = createPath(["models", `${type}.json`])

    const data = await readJSON(modelJson, [])
    return res.json(data)

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/", async (req, res) => {
  try {
    const { id, model, fileName } = req.body

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await resolveModelFile(
      model,
      {
        fileName,
        directory: createPath(["models"]),
        onProgress(status) {
          let progress = +Number((status.downloadedSize / status.totalSize) * 100).toFixed()
          res.write(`data: ${JSON.stringify({ progress, id })}\n\n`);
        }
      }
    );

    await updateJSONArr({
      filePath: createPath(["models", "downloaded.json"]),
      newData: { id, fileName }
    })

    res.write(`data: ${JSON.stringify({ progress: 100 })}\n\n`);
    res.end();

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/upload-llm/:folderName", upload.single('model'), async (req, res) => {
  try {
    await updateJSONArr({
      filePath: createPath(["models", "downloaded.json"]),
      newData: {
        id: req?.file?.filename?.replace(".gguf", ""),
        fileName: req?.file?.filename,
      }
    })

    await updateJSONArr({
      filePath: createPath(["models", "uploaded.json"]),
      newData: {
        id: req?.file?.filename?.replace(".gguf", ""),
        fileName: req?.file?.filename,
        ...req.body,
      }
    })

    return res.json({ msg: "success" })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.post("/upload-hf-llm", async (req, res) => {
  try {
    await updateJSONArr({
      filePath: createPath(["models", "uploaded.json"]),
      newData: req.body
    })

    return res.json({ msg: "success" })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

router.delete("/downloaded-model/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params

    await fs.rm(createPath(["models", fileName]))
    await updateJSONArr({
      filePath: createPath(["models", "downloaded.json"]),
      newData: { fileName },
      isRemove: true,
      by: "fileName",
    })
    await updateJSONArr({
      filePath: createPath(["models", "uploaded.json"]),
      newData: { fileName },
      isRemove: true,
      by: "fileName",
    })

    return res.json({ msg: "success" })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

export default router
