import constants from "../utils/constants";
import axios from "axios";

type payT = {
  url: string
  excludedLinks: string
  maxRequestsPerCrawl: string
}
export async function getSubLinks(payload: payT) {
  return axios.post(`${constants.backendUrl}/web-crawler/get-links`, payload).then(r => r.data)
}

type payloadT = {
  urls: string[]
  folderName: string
}
export async function crawleWeb(payload: payloadT) {
  return axios.post(`${constants.backendUrl}/web-crawler/crawle`, payload).then(r => r.data)
}
