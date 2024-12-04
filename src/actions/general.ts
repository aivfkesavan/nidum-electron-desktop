import axios from "axios";

import { deleteDevice } from "./device";
import constants from "../utils/constants";

type resetAppT = {
  deviceId: string
  includeModels: boolean
}
export async function resetApp(data: resetAppT) {
  try {
    await axios.post(`${constants.backendUrl}/nidum-chain/disable`)
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