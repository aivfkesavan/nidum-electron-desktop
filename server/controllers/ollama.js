import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { app } from 'electron'; // Import Electron's app module

import { executabeCommand, executableNames } from '../utils/executables.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

async function checkOllamaRunning(port) {
  try {
    await axios.get(`http://127.0.0.1:${port}`, { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
}

function runOllama(res) {
  const executable = executableNames[os.platform()] || executableNames.darwin;

  // Determine the base path dynamically depending on environment
  const basePath = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
  const fullPath = path.join(basePath, 'bin', executable);

  if (!fs.existsSync(fullPath)) {
    res.write(`data: ${JSON.stringify({ error: 'nidum not found at path ' + fullPath })}\n\n`);
    return res.end();
  }

  fs.chmodSync(fullPath, '755');

  const cmdFn = executabeCommand[os.platform()] || executabeCommand.darwin;
  const cmd = cmdFn(fullPath);

  const ollamaProcess = exec(cmd, (error) => {
    if (error) {
      console.error('Execution error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  ollamaProcess.on('spawn', () => {
    res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`);
    res.end();
  });
}

router.get('/', async (req, res) => {
  try {
    const isRunning = await checkOllamaRunning(11490);
    if (isRunning) {
      res.write(`data: ${JSON.stringify({ status: 'running' })}\n\n`);
      res.end();
      return;
    }
    return runOllama(res);
  } catch (error) {
    console.error('Download failed:', error);
    res.write(`data: ${JSON.stringify({ error: 'Download failed' })}\n\n`);
    res.end();
  }
});

export default router;
