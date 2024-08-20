import useContextStore from "@store/context";
import axios from "axios";

export async function getOllamaTags() {
  const ollamaUrl = useContextStore.getState().ollamaUrl
  return await axios.get(`${ollamaUrl}/api/tags`).then(r => r.data.models)
}

export async function deleteModel(name: string) {
  const ollamaUrl = useContextStore.getState().ollamaUrl

  return await axios.delete(`${ollamaUrl}/api/delete`, {
    data: { name }
  }).then(r => r.data)
}