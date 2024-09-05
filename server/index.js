import express from 'express';
import cors from "cors";

import { checkIsDirExists } from './utils/path-helper';
import duckduckgo from "./controllers/duckduckgo";
import upgrade from "./controllers/upgrade";
import whisper from "./controllers/whisper";
import ollama from "./controllers/ollama";
import image from "./controllers/image";
import doc from "./controllers/doc";

function startServer() {
  const app = express()
  const port = 4000

  checkIsDirExists()

  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use("/doc", doc)
  app.use("/nidum", ollama)
  app.use("/image", image)
  app.use("/whisper", whisper)
  app.use("/upgrade", upgrade)
  app.use("/duckduckgo", duckduckgo)

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

export default startServer
