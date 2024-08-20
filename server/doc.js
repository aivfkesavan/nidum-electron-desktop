const fs = require("fs/promises")
const express = require('express')
const { OllamaEmbedding, Settings, Document, VectorStoreIndex, } = require("llamaindex");
require("dotenv/config")

// const axios = require("axios")

const router = express.Router()

// const { SimpleDirectoryReader, } = require("llamaindex")

// async function get() {
//   try {
//     const reader = new SimpleDirectoryReader();
//     const documents = await reader.loadData("./doc");

//   } catch (error) {
//     console.log(error)
//   }
// }

router.get("/", async (req, res) => {
  try {
    const { query } = req.query

    Settings.embedModel = new OllamaEmbedding({ model: "mxbai-embed-large" });

    const essay = await fs.readFile(
      "node_modules/llamaindex/examples/abramov.txt",
      "utf-8",
    )

    const document = new Document({ text: essay, id_: "essay" })

    const index = await VectorStoreIndex.fromDocuments([document])

    const queryEngine = index.asQueryEngine()

    const response = await queryEngine.query({
      query,
    });

    // console.log(response?.message?.content)

    // const response = await axios.post("http://localhost:11434/api/embeddings", {
    //   model: "mxbai-embed-large",
    //   prompt: essay,
    // })
    // console.log(response.data)

    // const reader = new SimpleDirectoryReader();
    // const documents = await reader.loadData("/Users/rajkumar/Documents/nextron-with-shadcn-ui/server/doc");
    // console.log("documents-----", documents)

    return res.json({ msg: response?.message?.content })

  } catch (error) {
    res.status(400).json({ error, msg: "m" })
  }
})

module.exports = router
