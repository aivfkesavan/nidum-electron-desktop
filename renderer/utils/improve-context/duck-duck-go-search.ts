import axios from "axios";
import constants from "../constants";

async function duckDuckGoSerach(text: string) {
  const { data } = await axios.get(`${constants.backendUrl}/duck-search?text=${text}`)
  return data?.map((d: any) => d?.body)?.join(",")
}

export default duckDuckGoSerach