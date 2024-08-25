import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { executabeCommand, executableNames } from '../utils/executables.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

async function checkOllamaRunning(port) {
  try {
    await axios.get(`http://127.0.0.1:${port}`, { timeout: 1000 })
    return true

  } catch (error) {
    return false
  }
}

function runOllama(res) {
  const executable = executableNames[os.platform()] || executableNames.darwin
  const relativePath = path.join('..', 'bin', executable)
  const fullPath = path.resolve(__dirname, relativePath)
  fs.chmodSync(fullPath, '755')

  const cmdFn = executabeCommand[os.platform()] || executabeCommand.darwin
  const cmd = cmdFn(fullPath)

  const ollamaProcess = exec(cmd, (error) => {
    if (error) {
      console.error('Execution error:', error)
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
  // const urls = {
  //   darwin: "https://production.haive.in:5000/download/ollama",
  //   linux: "",
  //   win32: "",
  // }
  // const names = {
  //   darwin: "ollama",
  //   linux: "ollama",
  //   win32: "ollama.exe",
  // }
  // const downloadUrl = urls[os.platform()] || urls.darwin
  // const fileName = names[os.platform()] || names.darwin
  // const downloadPath = createPath([fileName])

  try {
    const isRunning = await checkOllamaRunning(11490)
    if (isRunning) {
      res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`)
      res.end()
      return
    }
    return runOllama(res)

    // fs.mkdirSync(getRoot(), { recursive: true, mode: 0o777 })

    // const response = await axios({
    //   method: 'get',
    //   url: downloadUrl,
    //   responseType: 'stream',
    //   onDownloadProgress: (progressEvent) => {
    //     const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //     res.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`)
    //   }
    // })
    // const writer = fs.createWriteStream(downloadPath)

    // response.data.pipe(writer)

    // writer.on('finish', () => {
    //   runOllama(res)
    // })

    // writer.on('error', (err) => {
    //   console.error('Write error:', err)
    //   res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`)
    //   res.end()
    // })

  } catch (error) {
    console.error('Download failed:', error)
    res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`)
    res.end()
  }
})

export default router