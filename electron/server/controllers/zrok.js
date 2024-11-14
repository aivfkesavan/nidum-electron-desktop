import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import express from 'express';
import path from 'path';
import os from 'os';
import 'dotenv/config';

import { runCommand, runCommandInBg } from '../utils/run-command';
import delay from '../utils/delay';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zrokExecutable = {
  win32: "zrok.exe",
  darwin: "./zrok",
}

const zrokStart = zrokExecutable[os.platform()] || "zrok"

const zrokBinary = process.env.NODE_ENV === "development"
  ? path.join(__dirname, "..", "public", 'bin')
  : path.join(__dirname, 'bin')

router.post("/enable", async (req, res) => {
  try {
    const { appId } = req.body

    const config = `${zrokBinary}/${zrokStart} config set apiEndpoint https://api.chain.nidum.ai`
    await runCommand(config)

    const enable = `${zrokBinary}/${zrokStart} enable YUgkOiDXdBLg`
    await runCommand(enable)

    const reserve = `${zrokBinary}/${zrokStart} reserve public http://localhost:4000 --unique-name ${appId}`
    await runCommand(reserve)

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
})

router.post("/go-public", async (req, res) => {
  try {
    const { appId } = req.body

    const share = `${zrokBinary}/${zrokStart} share reserved -p ${appId} --headless`
    await runCommandInBg(share)

    await delay(5000)
    const response = await fetch(`https://${appId}.chain.nidum.ai/health`)
    const status = response.status

    if (status === 200) {
      return res.json({ msg: "Success" })
    }

    return res.status(400).json({ msg: "not success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
})

router.post("/stop", async (req, res) => {
  try {
    const stop = "pkill zrok"
    await runCommand(stop)

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
})

router.post("/disable", async (req, res) => {
  try {
    try {
      const disable = `${zrokBinary}/${zrokStart} disable`
      await runCommand(disable)
    } catch (error) {
      console.log(error)
    }
    const homeDirectory = os.homedir()
    const zrokFolder = path.join(homeDirectory, ".zrok")
    await fs.rm(zrokFolder, { recursive: true })

    return res.json({ msg: "Success" })

  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
})

export default router;
