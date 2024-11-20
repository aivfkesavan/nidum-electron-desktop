import useUIStore from "../../../store/ui";

import DeleteProject from "./delete-project";
import DeleteChat from "./delete-chat";
import Project from "./project";

function Modals() {
  const open = useUIStore(s => s.open)

  return (
    <>
      {
        open === "project" &&
        <Project />
      }

      {
        open === "delete-project" &&
        <DeleteProject />
      }

      {
        open === "delete-chat" &&
        <DeleteChat />
      }
    </>
  )
}

export default Modals
