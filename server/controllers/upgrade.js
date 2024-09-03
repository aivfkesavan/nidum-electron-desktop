import { exec } from 'child_process';
import express from 'express';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import util from 'util'
import os from 'os';

import isLatestSemantic from '../utils/is-latest-semantic.js'
import { createPath } from '../utils/path-helper';

const router = express.Router()

const logPath = createPath(["app.log"])

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level}]: ${message}\n`;

  fs.appendFile(logPath, logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  })

  console.log(logMessage);
}

const execPromise = util.promisify(exec);

router.get('/install-dmg', async (req, res) => {
  try {
    const downloadsDir = path.join(os.homedir(), 'Downloads');
    const filePath = path.join(downloadsDir, "RAGDrive.dmg");

    log(`DMG file downloaded successfully to ${filePath}`);

    const { stdout: mountOutput } = await execPromise(`hdiutil attach "${filePath}"`);
    log(`Mount output: ${mountOutput}`);

    const mountLines = mountOutput.split('\n');
    const mountLine = mountLines.find(line => line.includes('/Volumes/'));
    if (!mountLine) throw new Error('Failed to find mount point in hdiutil output')

    const mountDir = mountLine.split('\t').pop().trim();
    log(`DMG mounted at: ${mountDir}`);

    if (!mountDir) {
      throw new Error('Failed to extract mount directory from hdiutil output');
    }

    log('Searching for .app directory');
    const files = await fs.readdir(mountDir);
    const appFile = files.find(file => file.endsWith('.app'));

    if (!appFile) {
      throw new Error('No .app file found in the mounted DMG');
    }

    const appPath = path.join(mountDir, appFile);
    log(`Found application: ${appPath}`);

    log('Copying application to /Applications');
    await execPromise(`cp -R "${appPath}" /Applications/`);
    log('Application copied successfully');

    log('Unmounting DMG');
    await execPromise(`hdiutil detach "${mountDir}"`);
    log('DMG unmounted successfully');

    // Clean up the downloaded file
    // await fs.unlink(filePath);
    // log(`Downloaded DMG file deleted: ${filePath}`);

    res.json({ msg: "success" })

  } catch (error) {
    log(`Error in install-dmg process: ${error.message}`, 'ERROR');
    res.status(500).send('Error: ' + error.message);
  }
})

router.get('/is-latest-version-available', async (req, res) => {
  try {
    const currentVersion = "1.0.3"
    const { data } = await axios.get("https://raw.githubusercontent.com/aivfkesavan/nidum-public/main/versions.json")
    const latestVersion = data?.[os.platform()] || data?.darwin

    if (!latestVersion) return res.json({ hasLatest: false })

    let payload = {
      hasLatest: isLatestSemantic(currentVersion, latestVersion),
    }

    if (payload.hasLatest) {
      payload.url = data?.[`${os.platform()}Url`] || data?.darwinUrl
    }

    return res.json(payload)

  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
