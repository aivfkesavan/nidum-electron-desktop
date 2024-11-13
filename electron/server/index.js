import express from 'express';
import cors from "cors";

import { checkPathsSetup } from './utils/path-helper';
import duckduckgo from "./controllers/duckduckgo";
import webcrawler from "./controllers/webcrawler";
import llamaChat from "./controllers/llama-chat";
import upgrade from "./controllers/upgrade";
import whisper from "./controllers/whisper";
import general from "./controllers/general";
import llama from "./controllers/llama";
import image from "./controllers/image";
import zrok from "./controllers/zrok";
import doc from "./controllers/doc";
import ai from "./controllers/ai";

const app = express()

checkPathsSetup()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/health", (req, res) => {
  return res.json({ status: "ok" })
})

app.use("/ai", ai)
app.use("/doc", doc)
app.use("/zrok", zrok)
app.use("/llama", llama)
app.use("/image", image)
app.use("/whisper", whisper)
app.use("/general", general)
app.use("/upgrade", upgrade)
app.use("/llama-chat", llamaChat)
app.use("/duckduckgo", duckduckgo)
app.use("/web-crawler", webcrawler)

export default app
