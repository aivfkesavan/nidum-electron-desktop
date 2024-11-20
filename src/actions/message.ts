import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getMessage(chat_id: string) {
  return sendApiReq({
    url: `${endPoints.message}/${chat_id}`,
  })
}

export function createMessage(data: any) {
  return sendApiReq({
    url: endPoints.message,
    method: "post",
    data,
  })
}

export function updateMessage(data: any) {
  return sendApiReq({
    url: endPoints.message,
    method: "put",
    data,
  })
}

export function deleteMessage(_id: string) {
  return sendApiReq({
    url: `${endPoints.message}/${_id}`,
    method: "delete",
    data: {}
  })
}
