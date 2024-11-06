import expressWinston from 'express-winston';
import express from 'express';
import cors from "cors";

import { checkPathsSetup } from './utils/path-helper';
import duckduckgo from "./controllers/duckduckgo";
import webcrawler from "./controllers/webcrawler";
import llamaChat from "./controllers/llama-chat";
import upgrade from "./controllers/upgrade";
import whisper from "./controllers/whisper";
import llama from "./controllers/llama";
import image from "./controllers/image";
import doc from "./controllers/doc";
import ai from "./controllers/ai";

import logger from './utils/logger';

const app = express()

checkPathsSetup()

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}))

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/ai", ai)
app.use("/doc", doc)
app.use("/llama", llama)
app.use("/llama-chat", llamaChat)
app.use("/web-crawler", webcrawler)
app.use("/image", image)
app.use("/whisper", whisper)
app.use("/upgrade", upgrade)
app.use("/duckduckgo", duckduckgo)

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  })
})

app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}))

export default app
