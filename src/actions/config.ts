import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getConfig() {
  return sendApiReq({
    url: endPoints.config,
  })
}

export function createConfig(data: any) {
  return sendApiReq({
    url: endPoints.config,
    method: "postt",
    data,
  })
}

export function updateConfig(data: any) {
  return sendApiReq({
    url: endPoints.config,
    method: "put",
    data,
  })
}

export function deleteConfig(_id: string) {
  return sendApiReq({
    url: `${endPoints.config}/${_id}`,
    method: "delete",
    data: {}
  })
}
