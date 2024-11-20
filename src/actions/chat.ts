import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getChat(project_id: string) {
  return sendApiReq({
    url: `${endPoints.chat}/${project_id}`,
  })
}

export function createChat(data: any) {
  return sendApiReq({
    url: endPoints.chat,
    method: "post",
    data,
  })
}

export function updateChat(data: any) {
  return sendApiReq({
    url: endPoints.chat,
    method: "put",
    data,
  })
}

export function deleteChat(_id: string) {
  return sendApiReq({
    url: `${endPoints.chat}/${_id}`,
    method: "delete",
    data: {}
  })
}
