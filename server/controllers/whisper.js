import express from 'express';
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  convertToCaptions,
} from "@remotion/install-whisper-cpp";

import { getWhisperPath } from '../utils/path-helper.js';
import { upload } from "../middleawres/upload.js";

const router = express.Router()

router.post("/", async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const sendProgress = (message) => res.write(`data: ${JSON.stringify(message)}\n\n`)

  try {
    const whisperPath = getWhisperPath()

    sendProgress({ stage: 'install', status: 'started' })
    await installWhisperCpp({
      to: whisperPath,
      version: "1.5.5",
    })
    sendProgress({ stage: 'install', status: 'completed' })

    sendProgress({ stage: 'download', status: 'started' })
    await downloadWhisperModel({
      model: "medium.en",
      folder: whisperPath,
      onProgress(r) {
        sendProgress({ stage: 'download', status: 'in-progress', progress: r })
      }
    })
    sendProgress({ stage: 'download', status: 'completed' })

    sendProgress({ stage: 'overall', status: 'completed' })

  } catch (error) {
    sendProgress({ stage: 'error', error: error.message })
  } finally {
    res.end()
  }
})

router.post("/transcribe/:folderName", upload.single('audio'), async (req, res) => {
  try {
    const whisperPath = getWhisperPath()
    const { transcription } = await transcribe({
      tokenLevelTimestamps: true,
      inputPath: req.file.path,
      model: "medium.en",
      whisperPath,
    })

    const { captions } = convertToCaptions({
      combineTokensWithinMilliseconds: 200,
      transcription,
    })

    const transcriped = captions?.map(cap => cap.text).join(' ')

    return res.json({ transcriped })

  } catch (error) {
    return res.status(500).json({ error })
  }
})

export default router
