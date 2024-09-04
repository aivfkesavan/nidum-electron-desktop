import constants from "@utils/constants";
import axios from "axios";

type payloadT = {
  url: string
  folderName: string
  maxRequestsPerCrawl?: number
}

export async function crawleWeb(payload: payloadT) {
  return axios.post(`${constants.backendUrl}/web-crawler`, payload).then(r => r.data)
}
