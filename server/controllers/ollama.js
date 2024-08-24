import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import os from 'os';

import { createPath } from '../utils/path-helper.js';

const router = express.Router()

function runOllama(res) {
  const names = {
    darwin: "ollama",
    linux: "ollama",
    win32: "ollama.exe",
  }
  const fileName = names[os.platform()] || names.darwin
  const downloadPath = createPath([fileName])
  fs.chmodSync(downloadPath, '755')

  const ollamaProcess = exec(`OLLAMA_HOST=127.0.0.1:11490 ${downloadPath} serve`, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error)
      // return res.status(500).json({ error: 'Execution failed' })
      res.write(`data: ${JSON.stringify({ error })}\n\n`)
      res.end()
    }
  })

  ollamaProcess.on('spawn', () => {
    res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`)
    res.end()
  })
}

router.get('/', async (req, res) => {
  const urls = {
    darwin: "https://production.haive.in:5000/download/ollama",
    linux: "",
    win32: "",
  }
  const names = {
    darwin: "ollama",
    linux: "ollama",
    win32: "ollama.exe",
  }
  const downloadUrl = urls[os.platform()] || urls.darwin
  const fileName = names[os.platform()] || names.darwin
  const downloadPath = createPath([fileName])

  if (fs.existsSync(downloadPath)) return runOllama(res)

  try {
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        res.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`)
      }
    })
    const writer = fs.createWriteStream(downloadPath)

    response.data.pipe(writer)

    writer.on('finish', () => {
      runOllama(res)
    })

    writer.on('error', (err) => {
      console.error('Write error:', err)
      res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`)
      res.end()
    })

  } catch (error) {
    console.error('Download failed:', error)
    res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`)
    res.end()
  }
})

export default router