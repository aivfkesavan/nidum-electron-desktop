import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

export function getProjectsByUserId() {
  return sendApiReq({
    url: endPoints.project,
  })
}

export const projectLimit = 20
export function getProjectsMiniByUserId(pageParam: number) {
  return sendApiReq({
    url: endPoints.project,
    params: {
      skip: pageParam * projectLimit,
      limit: projectLimit,
    }
  })
}

export function getProjectById(project_id: string) {
  return sendApiReq({
    url: `${endPoints.project}/${project_id}`,
  })
}

export function createProject(data: any) {
  return sendApiReq({
    url: endPoints.project,
    method: "post",
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
