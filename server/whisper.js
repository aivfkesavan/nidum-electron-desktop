const express = require('express')
const {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  convertToCaptions,

} = require("@remotion/install-whisper-cpp");

const router = express.Router()

const { upload } = require("./add-files")

router.post("/", async (req, res) => {
  try {
    const to = "/Users/rajkumar/.nidum/whisper/whisper.cpp"
    const re = await installWhisperCpp({
      to,
      version: "1.5.5",
    });
    console.log(re)

    const g = await downloadWhisperModel({
      model: "medium.en",
      folder: to,
      onProgress(r) {
        console.log(r)
      }
    })
    console.log(g)

    res.send("nljnkl")
  } catch (error) {
    console.log(error)
    res.send("nljnkl")
  }
})

router.post("/transcribe/:folderName", upload.single('audio'), async (req, res) => {
  try {
    const to = "/Users/rajkumar/.nidum/whisper/whisper.cpp"
    const { transcription } = await transcribe({
      model: "medium.en",
      whisperPath: to,
      inputPath: req.file.path,
      tokenLevelTimestamps: true,
    });

    const { captions } = convertToCaptions({
      transcription,
      combineTokensWithinMilliseconds: 200,
    });

    const transcriped = captions?.map(cap => cap.text).join(' ')
    console.log(transcriped)

    res.send("nljnkl")

  } catch (error) {
    console.log(error)
    res.send("nljnkl")
  }
})

module.exports = router
