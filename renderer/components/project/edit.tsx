// import { useParams } from "react-router-dom";

import useConvoStore from "@/store/conversations";
import Model from "./model";

function Page() {
  // const { id } = useParams()
  const id = ""
  const found = useConvoStore(s => s.projects[id as string] || null)

  return <Model id={id as string} data={found} open closeModel={() => { }} />
}

export default Page
