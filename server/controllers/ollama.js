import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
// import os from 'os';
import { fileURLToPath } from 'url';

// import { createPath, getRoot } from '../utils/path-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

async function checkOllamaRunning(port) {
  try {
    const g = await axios.get(`http://127.0.0.1:${port}`, { timeout: 1000 });
    console.log(g)
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
function runOllama(res) {
  const names = {
    darwin: "ollama",
    linux: "ollama",
    win32: "ollama.exe",
  }
  // const fileName = names[os.platform()] || names.darwin
  // const downloadPath = createPath([fileName])
  // fs.chmodSync(downloadPath, '755')

  const relativePath = path.join('..', 'bin', "ollama");
  // console.log(relativePath)
  // Resolve the full path
  const fullPath = path.resolve(__dirname, relativePath);
  // console.log(fullPath)
  // Ensure the file has the correct permissions
  fs.chmodSync(fullPath, '755')

  const ollamaProcess = exec(`OLLAMA_HOST=127.0.0.1:11490 ${fullPath} serve`, (error, stdout, stderr) => {
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
    // console.log({ isRunning })
    if (isRunning) {
      // console.log("inside isRunning")
      res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`)
      res.end()
      return
    }
    // console.log("next list")
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