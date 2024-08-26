// import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
// import path from 'path';
import fs from 'fs';
import os from 'os';

import { executabeCommand, executableLinks, executableNames } from '../utils/executables.js';
import { createPath } from '../utils/path-helper.js';

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

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
  const execPath = createPath([".executables", executable])
  fs.chmodSync(execPath, '755')

  const cmdFn = executabeCommand[os.platform()] || executabeCommand.darwin
  const cmd = cmdFn(execPath)
  // console.log("going to run", cmd)

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
  try {
    const executable = executableNames[os.platform()] || executableNames.darwin
    const executablePath = createPath([".executables", executable])
    // console.log({ executablePath })
    if (fs.existsSync(executablePath)) {
      // console.log("path found")
      const isRunning = await checkOllamaRunning(11490)
      if (isRunning) {
        res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`)
        res.end()
        return
      }
      return runOllama(res)
    }

    const basePath = createPath([".executables"])
    // console.log({ basePath })
    fs.mkdirSync(basePath, { recursive: true, mode: 0o777 })

    const downloadUrl = executableLinks[os.platform()] || executableLinks.darwin
    // console.log({ downloadUrl })
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        res.write(`data: ${JSON.stringify({ progress: percentage })}\n\n`)
      }
    })
    const writer = fs.createWriteStream(executablePath)

    response.data.pipe(writer)

    writer.on('finish', () => {
      // console.log("finished nidum download")
      return runOllama(res)
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
