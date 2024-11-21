import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

type payT = {
  project_id: string
  pageParam: number
}
export const chatLimit = 20
export function getChatsByProjectId(payload: payT) {
  return sendApiReq({
    url: `${endPoints.chat}/${payload.project_id}`,
    params: {
      skip: payload.pageParam * chatLimit,
      limit: chatLimit,
    }
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
