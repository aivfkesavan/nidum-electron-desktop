import useContextStore from "@store/context";
import axios from "axios";

export async function getOllamaTags(ollamaUrl: string) {
  return axios.get(`${ollamaUrl}/api/tags`).then(r => r.data.models)
}

export async function deleteModel(name: string) {
  const ollamaUrl = useContextStore.getState().ollamaUrl

  return axios.delete(`${ollamaUrl}/api/delete`, {
    data: { name }
  }).then(r => r.data)
}