import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getProject() {
  return sendApiReq({
    url: endPoints.project,
  })
}

export function createProject(data: any) {
  return sendApiReq({
    url: endPoints.project,
    method: "postt",
    data,
  })
}

export function updateProject(data: any) {
  return sendApiReq({
    url: endPoints.project,
    method: "put",
    data,
  })
}

export function deleteProject(_id: string) {
  return sendApiReq({
    url: `${endPoints.project}/${_id}`,
    method: "delete",
    data: {}
  })
}
