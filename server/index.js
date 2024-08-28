import express from 'express';
import cors from "cors";

import duckduckgo from "./controllers/duckduckgo";
import whisper from "./controllers/whisper";
import ollama from "./controllers/ollama";
import doc from "./controllers/doc";

function startServer() {
  const app = express()
  const port = 4000

  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use("/doc", doc)
  app.use("/nidum", ollama)
  app.use("/whisper", whisper)
  app.use("/duckduckgo", duckduckgo)

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

export default startServer
