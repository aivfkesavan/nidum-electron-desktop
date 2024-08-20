import useContextStore from "@store/context";
import axios from "axios";

async function ragSearch(query: string) {
  const project_id = useContextStore.getState().project_id
  const { data } = await axios.get(`http://localhost:4000/doc/ask/${project_id}/?query=${query}`)
  return data?.map((d: any) => d?.text)?.join(",")
}

export default ragSearch
