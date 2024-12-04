import axios from "axios";

import constants from "../../utils/constants";

async function ragSearch(query: string) {
  const pathname = window.location.hash
  const project_id = pathname.split('/')?.[2]
  const { data } = await axios.get(`${constants.backendUrl}/doc/${project_id}/?query=${query}`)
  return data?.map((d: any) => d?.text)?.join(",")
}

export default ragSearch
