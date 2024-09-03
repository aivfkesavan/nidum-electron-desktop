import constants from "@utils/constants";
import axios from "axios";

export async function installLatestDMG() {
  const url = "https://releases.nidum.ai/download/downloads/RAGDrive-1.0.3-arm64.dmg"
  return axios.get(`${constants.backendUrl}/upgrade/install-dmg?url=${url}`).then(r => r.data)
}

export async function isLatestVersionAvailable() {
  return axios.get(`${constants.backendUrl}/upgrade/is-latest-version-available`).then(r => r.data)
}
