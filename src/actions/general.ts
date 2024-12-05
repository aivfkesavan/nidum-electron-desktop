import axios from "axios";

import { deleteDevice, disableZrok } from "./device";
import constants from "../utils/constants";

type resetAppT = {
  deviceId: string
  includeModels: boolean
}
export async function resetApp(data: resetAppT) {
  try {
    await disableZrok(data.deviceId)
  } catch (error) {
    console.log(error)
  }

  try {
    await axios.post(`${constants.backendUrl}/general/remove-files`, { includeModels: data.includeModels })
  } catch (error) {
    console.log(error)
  }

  try {
    await deleteDevice(data.deviceId)
  } catch (error) {
    console.log(error)
  }
}