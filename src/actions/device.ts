import axios from "axios";
import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";
import constants from "../utils/constants";

export function getInitDevice(deviceId: string) {
  return sendApiReq({
    url: `${endPoints.initDevice}/${deviceId}`,
  })
}

export function getSharedDevice(deviceId: string) {
  return sendApiReq({
    url: `${endPoints.sharedDevice}/${deviceId}`,
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

export function deleteDevice(deviceId: string) {
  return sendApiReq({
    url: `${endPoints.device}/${deviceId}`,
    method: "delete",
    data: {}
  })
}

export function nidumChainUrlConfig() {
  return axios.post(`${constants.backendUrl}/nidum-chain/url-config`).then(r => r.data)
}

export function nidumChainEnable() {
  return axios.post(`${constants.backendUrl}/nidum-chain/enable`).then(r => r.data)
}

export function nidumChainReserve(deviceId: string) {
  return axios.post(`${constants.backendUrl}/nidum-chain/reserve`, { deviceId }).then(r => r.data)
}

export function goPublic(deviceId: string) {
  return axios.post(`${constants.backendUrl}/nidum-chain/go-public`, { deviceId }).then(r => r.data)
}

export function stopPublicShare() {
  return axios.post(`${constants.backendUrl}/nidum-chain/stop`).then(r => r.data)
}

export function disableZrok() {
  return axios.post(`${constants.backendUrl}/nidum-chain/disable`).then(r => r.data)
}
