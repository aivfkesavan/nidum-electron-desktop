import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import express from 'express';
import path from 'path';
import os from 'os';
import 'dotenv/config';

import { execPromise, runCommandInBg } from '../utils/run-command';
import logger from '../utils/logger';
import delay from '../utils/delay';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zrokExecutable = {
  win32: "nidum.exe",
  darwin: "./nidum",
}

const zrokStart = zrokExecutable[os.platform()] || "nidum"

const zrokBinary = process.env.NODE_ENV === "development"
  ? path.join(__dirname, "..", "public", "bin")
  : path.join(process.resourcesPath, "bin");

const stopZrokCmd = os.platform() === "win32" ? "taskkill /F /IM nidum.exe" : "pkill nidum"
const zrokPath = path.join(zrokBinary, zrokStart)

async function isLiveCheck(appId) {
  const response = await fetch(`https://${appId}.chain.nidum.ai/health`)
  const status = response.status
  return status === 200
}

router.post("/enable", async (req, res) => {
  try {
    const { appId } = req.body

    const config = `${path.join(zrokBinary.replace(/ /g, '\\ '), zrokStart)} config set apiEndpoint https://api.chain.nidum.ai`;
    await execPromise(config)

    const enable = `"${zrokPath}" enable xIoAvryd2Svl`;
    await execPromise(enable)

    const reserve = `"${zrokPath}" reserve public http://localhost:4000 --unique-name ${appId}`;
    await execPromise(reserve)

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message });
  }
})

router.post("/go-public", async (req, res) => {
  try {
    const { appId } = req.body

    try {
      await execPromise(stopZrokCmd)
    } catch (error) {
      console.log("error on killing")
    }

    if (os.platform() === "win32") {
      const share = `Start-Process -FilePath ${zrokPath} -ArgumentList 'share reserved -p ${appId} --headless' -NoNewWindow`;
      execPromise(share, { shell: "powershell.exe" })

    } else {
      const share = `"${zrokPath}" share reserved -p ${appId} --headless`;
      await runCommandInBg(share)
    }

    await delay(5000)

    const isLive = await isLiveCheck(appId)
    if (isLive) return res.json({ msg: "Success" })

    return res.status(400).json({ msg: "not success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message });
  }
})

router.post("/stop", async (req, res) => {
  try {
    await execPromise(stopZrokCmd)

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.json({ error: error.message });
  }
})

router.post("/disable", async (req, res) => {
  try {
    try {
      const disable = `"${zrokPath}" disable`;
      await execPromise(disable)
    } catch (error) {
      console.log(error)
    }
    const homeDirectory = os.homedir()
    const zrokFolder = path.join(homeDirectory, ".zrok")
    await fs.rm(zrokFolder, { recursive: true })

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message });
  }
})

export default router;
