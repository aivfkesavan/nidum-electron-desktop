import { useState, useEffect, useRef } from 'react';
// import { QdrantClient } from '@qdrant/js-client-rest';
import pdfToText from "react-pdftotext";

import useContextStore from '@/store/context';
import useConvoStore from '@/store/conversations';
import getEmbeddings from '@/utils/get-embeddings';
import { useToast } from '@/components/ui/use-toast';

function useEmbedding() {
  // const [client, setClient] = useState<QdrantClient | null>(null)
  const [loading, setLoading] = useState(false)
  const embRef = useRef<number | null>(null)
  const { toast } = useToast()

  const qdrantDBApiKey = useContextStore(s => s.qdrantDBApiKey)
  const qdrantDBUrl = useContextStore(s => s.qdrantDBUrl)
  const vb_type = useContextStore(s => s.vb_type)
  const nidum_url = "https://c69b-164-52-211-150.ngrok-free.app"
  const nidum_apiKey = "admin123"

  const projectId = useContextStore(s => s.project_id)
  const addFile = useConvoStore(s => s.addFile)

  // useEffect(() => {
  //   const url = vb_type === "Nidum" ? "83fe-164-52-211-150.ngrok-free.app" : qdrantDBUrl
  //   const qdrantClient = new QdrantClient({ url: "https://5cb18f08-451a-4ba3-8867-aefe6ae864fe.europe-west3-0.gcp.cloud.qdrant.io:6333", apiKey: "2uUUf-DSXJZzSWKS6zOEakb7qSDeFliK_Tre7VzCICzNlLzQb7nmXQ" })
  //   setClient(qdrantClient)
  // }, [qdrantDBUrl, vb_type])

  async function createCollection(currDim: number, collectionName: string) {
    try {
      const prevDim = embRef.current
      const url = vb_type === "Nidum" ? nidum_url : qdrantDBUrl
      const apiKey = vb_type === "Nidum" ? nidum_apiKey : qdrantDBApiKey

      if (prevDim === null) {
        await fetch(`${url}/collections/${collectionName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey || "admin123"
          },
          body: JSON.stringify({
            "vectors": {
              "size": currDim,
              "distance": "Cosine"
            }
          }),
        })
        // await client?.createCollection(collectionName, {
        //   vectors: {
        //     size: currDim,
        //     distance: 'Cosine',
        //   }
        // });
        // console.log(`Collection ${collectionName} created ${currDim}`);

      } else if (prevDim !== currDim) {
        await fetch(`${url}/collections/${collectionName}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey || ""
          },
          body: JSON.stringify({
            "vectors": {
              "size": currDim,
              "distance": "Cosine"
            }
          }),
        })
        await fetch(`${url}/collections/${collectionName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey || ""
          },
          body: JSON.stringify({
            "vectors": {
              "size": currDim,
              "distance": "Cosine"
            }
          }),
        })
        // await client?.deleteCollection(collectionName);
        // await client?.createCollection(collectionName, {
        //   vectors: {
        //     size: currDim,
        //     distance: 'Cosine',
        //   }
        // });
        // console.log(`Collection ${collectionName} recreated ${currDim}`);
      }
      embRef.current = currDim

    } catch (error) {
      console.error(`Error creating collection: ${error}`)
      throw error
    }
  }

  function chunkText(text: string, wordCount: number = 300): string[] {
    const words = text.split(/\s+/)
    const chunks: string[] = []

    for (let i = 0; i < words.length; i += wordCount) {
      chunks.push(words.slice(i, i + wordCount).join(' '))
    }

    return chunks
  }

  async function storeInQdrant(embedding: number[], text: string, index: number, collectionName: string) {
    // if (!client) throw new Error("Qdrant client is not initialized")

    try {
      const url = vb_type === "Nidum" ? nidum_url : qdrantDBUrl
      const apiKey = vb_type === "Nidum" ? nidum_apiKey : qdrantDBApiKey

      await fetch(`${url}/collections/${collectionName}/points`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey || "admin123"
        },
        body: JSON.stringify({
          points: [{
            id: index,
            vector: embedding,
            payload: { text }
          }]
        }),
      })
      // await client.upsert(collectionName, {
      //   wait: true,
      //   points: [{
      //     id: index,
      //     vector: embedding,
      //     payload: { text }
      //   }]
      // })
      // console.log(`Stored embedding for chunk ${index} in Qdrant`)

    } catch (error) {
      console.error(`Error storing in Qdrant:`, error)
      throw error
    }
  }

  async function processChunk(chunk: string, index: number, collectionName: string) {
    try {
      // console.log(chunk)
      const embedding = await getEmbeddings(chunk)
      await createCollection(embedding.length, collectionName)

      await storeInQdrant(embedding, chunk, index, collectionName)

    } catch (error) {
      console.error(`Error processing chunk ${index + 1}:`, error)
      throw error
    }
  }

  type processFileT = {
    file: File
    collectionName: string
    onSuccess: () => void
  }

  async function processFile({ file, collectionName, onSuccess = () => { } }: processFileT) {
    try {
      setLoading(true)
      const text = await pdfToText(file)
      const chunks = chunkText(text)

      for (let i = 0; i < chunks.length; i++) {
        await processChunk(chunks[i], i, collectionName)
      }

      embRef.current = null
      setLoading(false)
      onSuccess?.()
      addFile(projectId, {
        id: collectionName,
        name: file.name,
        size: file.size,
        type: file.type,
      })

    } catch (error) {
      embRef.current = null
      setLoading(false)
      toast({ title: "Cors error from QdrantDB" })
      console.error("Failed to process PDF:", error)
    }
  }

  return {
    loading,
    processFile,
  }
}

export default useEmbedding
