import axios from "axios";
import constants from "../utils/constants";

export async function getLLMModels(llm: string) {
  return axios.get(`https://raw.githubusercontent.com/NidumAI-Inc/catalog/main/${llm}-models.json`).then(r => r.data)
}

export async function getModelPath(path: string) {
  return axios.get(`${constants.backendUrl}/llama/model-path/${path}`).then(r => r.data)
}

export type modelTypeT = "downloaded" | "uploaded"
export async function getLLamaDownloadedModels(type: modelTypeT) {
  return axios.get(`${constants.backendUrl}/llama/models/${type}`).then(r => r.data)
}

export async function getHFModelDetails(id: string) {
  return axios.get(`https://huggingface.co/api/models/${id}`).then(r => r.data)
}

type fileRes = {
  oid: string
  path: string
  size: number
  type: string
}
export async function getHFModelTree(id: string) {
  return axios.get<fileRes[]>(`https://huggingface.co/api/models/${id}/tree/main`).then(r => r.data)
}

export async function uploadModel(payload: any) {
  return axios.post(`${constants.backendUrl}/llama/upload-llm/models`, payload).then(r => r.data)
}

export async function uploadHFModel(payload: any) {
  return axios.post(`${constants.backendUrl}/llama/upload-hf-llm`, payload).then(r => r.data)
}

export async function deleteDownloadedModel(fileName: string) {
  return axios.delete(`${constants.backendUrl}/llama/downloaded-model/${fileName}`).then(r => r.data)
}
