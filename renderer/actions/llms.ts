import axios from "axios";

export async function getLLMModels(llm: string) {
  return axios.get(`https://raw.githubusercontent.com/aivfkesavan/nidum-public/main/${llm}-models.json`).then(r => r.data)
}
