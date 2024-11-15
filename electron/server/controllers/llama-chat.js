import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from 'express';

import { createPath } from "../utils/path-helper";

const router = express.Router()

router.post("/", async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const { modelName, messages, message } = req.body
    const [systemPrompt, ...rest] = messages

    console.log(systemPrompt)
    console.log(rest)

    const llama = await getLlama()
    const model = await llama.loadModel({
      modelPath: createPath(["models", modelName])
    })

    const context = await model.createContext()
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: systemPrompt?.text || ""
    })

    if (rest?.length > 0) {
      session.setChatHistory(rest)
    }

    await session.prompt(message, {
      onTextChunk: reply => {
        res.write(`data: ${JSON.stringify({ reply })}\n\n`)
      }
    })

    res.end()

  } catch (error) {
    console.log(error)
    res.write(`data: ${JSON.stringify({ error: "Something bad" })}\n\n`)
    return res.end()
  }
})

router.post("/2", async (req, res) => {
  try {
    const { modelName, messages, message } = req.body
    const [systemPrompt, ...rest] = messages

    const llama = await getLlama()
    const model = await llama.loadModel({
      modelPath: createPath(["models", modelName])
    })

    const context = await model.createContext()
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: systemPrompt?.text || ""
    })

    if (rest?.length > 0) {
      session.setChatHistory(rest)
    }

    const content = await session.prompt(message)

    return res.json({ choices: [{ message: { content } }] })

  } catch (error) {
    return res.status(404).json({ msg: "cannot convert into base64" })
  }
})

export default router
