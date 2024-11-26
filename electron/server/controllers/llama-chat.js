import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from 'express';

import { createPath } from "../utils/path-helper";

const router = express.Router()

function num(n, defaultVal) {
  return (n || n === 0) ? Number(n) : defaultVal
}

router.post("/", async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const { modelName, messages, message, ...restParams } = req.body
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

    const topP = num(restParams?.top_p, 1)
    const maxTokens = num(restParams?.max_tokens, 500)
    const temperature = num(restParams?.temperature, 0.1)
    const frequencyPenalty = num(restParams?.frequency_penalty, 0)

    await session.prompt(message, {
      topP,
      maxTokens,
      temperature,
      repeatPenalty: {
        frequencyPenalty
      },
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
    const { modelName, messages, message, ...restParams } = req.body
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

    const topP = num(restParams?.top_p, 1)
    const maxTokens = num(restParams?.max_tokens, 500)
    const temperature = num(restParams?.temperature, 0.1)
    const frequencyPenalty = num(restParams?.frequency_penalty, 0)

    const content = await session.prompt(message, {
      topP,
      maxTokens,
      temperature,
      repeatPenalty: {
        frequencyPenalty
      }
    })

    return res.json({ choices: [{ message: { content } }] })

  } catch (error) {
    return res.status(404).json({ msg: "cannot convert into base64" })
  }
})

export default router
