import useContextStore from "@store/context";
import constants from "@utils/constants";
import axios from "axios";

export async function uploadImg(files: File[]) {
  try {
    const chat_id = useContextStore.getState().chat_id
    const folderName = `img_${chat_id}`
    const formData = new FormData()
    files.forEach(file => formData.append("images", file))
    return axios.post(`${constants.backendUrl}/image/${folderName}`, formData).then(r => r.data)

  } catch (error) {
    console.log(error)
  }
}

export async function deleteImg(fileName: string) {
  const chat_id = useContextStore.getState().chat_id
  const folderName = `img_${chat_id}`

  return axios.delete(`${constants.backendUrl}/image/${folderName}/${fileName}`).then(r => r.data)
}
