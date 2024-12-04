import useUIStore from "../../../store/ui";

import DeleteProject from "./delete-project";
import DeleteChat from "./delete-chat";
import Download from "./download";
import Project from "./project";
import Profile from "./profile";

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

      {
        open === "profile" &&
        <Profile />
      }

      {
        open === "download" &&
        <Download />
      }
    </>
  )
}

export default Modals
