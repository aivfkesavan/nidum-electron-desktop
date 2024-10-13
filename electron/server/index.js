import express from 'express';
import cors from "cors";

import { checkIsDirExists } from './utils/path-helper';
import duckduckgo from "./controllers/duckduckgo";
import upgrade from "./controllers/upgrade";
import whisper from "./controllers/whisper";
import ollama from "./controllers/ollama";
import llama from "./controllers/llama";
import image from "./controllers/image";
import doc from "./controllers/doc";
import ai from "./controllers/ai";

const app = express()

checkIsDirExists()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/ai", ai)
app.use("/doc", doc)
app.use("/llama", llama)
app.use("/nidum", ollama)
app.use("/image", image)
app.use("/whisper", whisper)
app.use("/upgrade", upgrade)
app.use("/duckduckgo", duckduckgo)

export default app
