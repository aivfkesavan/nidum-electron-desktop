const express = require('express');
const cors = require("cors")

const whisper = require("./whisper")
const doc = require("./doc")

function startServer() {
  const app = express()
  const port = 4000

  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use("/doc", doc)
  app.use("/whisper", whisper)

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

module.exports = startServer
