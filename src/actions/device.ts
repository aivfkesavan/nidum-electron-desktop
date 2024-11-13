import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getDeviceInfo(appId: string) {
  return sendApiReq({
    url: `${endPoints.initDevice}/${appId}`,
  })
}

type deviceT = { name: string, _id: string }
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
