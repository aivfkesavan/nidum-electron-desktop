const express = require('express')
const {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  convertToCaptions,

} = require("@remotion/install-whisper-cpp");

const router = express.Router()

const { getWhisperPath } = require('server/utils/path-helper');
const { upload } = require("../middleawres/upload");

router.post("/", async (req, res) => {
  try {
    const whisperPath = getWhisperPath()
    await installWhisperCpp({
      to: whisperPath,
      version: "1.5.5",
    })

    await downloadWhisperModel({
      model: "medium.en",
      folder: whisperPath,
      onProgress(r) {
        console.log(r)
      }
    })

    res.send("")

  } catch (error) {
    return res.status(500).json({ error })
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

module.exports = router
