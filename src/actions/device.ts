import axios from "axios";

import useDeviceStore, { nanoid } from "../store/device";
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

type deviceT2 = { appId: string, newAppId: string }
export function updateDeviceAppId(data: deviceT2) {
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

export function nidumChainSetupStaus() {
  return axios.post(`${constants.backendUrl}/nidum-chain/setup-status`).then(r => r.data)
}

export async function nidumChainSetupFlow(deviceId: string, disable?: boolean) {
  try {
    const newDeviceId = disable ? nanoid() : deviceId
    if (disable) {
      await updateDeviceAppId({ appId: deviceId, newAppId: newDeviceId })
      await disableZrok(deviceId)
    }
    await nidumChainUrlConfig()
    await nidumChainEnable()
    await nidumChainReserve(newDeviceId)
    useDeviceStore.setState({ deviceId: newDeviceId })

  } catch (error) {
    console.log(error)
  }
}

export function goPublic(deviceId: string) {
  return axios.post(`${constants.backendUrl}/nidum-chain/go-public`, { deviceId }).then(r => r.data)
}

export async function isLiveCheck(deviceId: string) {
  const response = await fetch(`https://${deviceId}.chain.nidum.ai/health`)
  const status = response.status
  return status === 200
}

export function stopPublicShare() {
  return axios.post(`${constants.backendUrl}/nidum-chain/stop`).then(r => r.data)
}

export function disableZrok(deviceId: string) {
  return axios.post(`${constants.backendUrl}/nidum-chain/disable`, { deviceId }).then(r => r.data)
}
