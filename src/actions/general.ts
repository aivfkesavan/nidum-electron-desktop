import axios from "axios";
import constants from "../utils/constants";

type resetAppT = {
  includeModels: boolean
}
export async function resetApp(data: resetAppT) {
  try {
    await axios.post(`${constants.backendUrl}/zrok/disable`)
    await axios.post(`${constants.backendUrl}/general/remove-files`, { includeModels: data.includeModels })

  } catch (error) {
    console.log(error)
  }
}