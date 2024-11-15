import axios from "axios";
import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";
import constants from "../utils/constants";

export function getDeviceInfo(appId: string) {
  return sendApiReq({
    url: `${endPoints.initDevice}/${appId}`,
  })
}

export function getDomainBase() {
  return sendApiReq({
    url: endPoints.domainBase,
  })
}

type deviceT = { name?: string, _id: string, modelName?: string }
export function updateDevice(data: deviceT) {
  return sendApiReq({
    url: endPoints.device,
    method: "put",
    data,
  })
}

export function deleteDevice(appId: string) {
  return sendApiReq({
    url: `${endPoints.device}/${appId}`,
    method: "delete",
  })
}

export function enableZrok(appId: string) {
  return axios.post(`${constants.backendUrl}/zrok/enable`, { appId }).then(r => r.data)
}

export function goPublic(appId: string) {
  return axios.post(`${constants.backendUrl}/zrok/go-public`, { appId }).then(r => r.data)
}

export function stopPublicShare(appId: string) {
  return axios.post(`${constants.backendUrl}/zrok/stop`, { appId }).then(r => r.data)
}

export function disableZrok() {
  return axios.post(`${constants.backendUrl}/zrok/disable`).then(r => r.data)
}
