import useOnlineStatus from "../../../hooks/use-online-status";

import ModelSelect from "./model-select";
import Account from "./account";
import Create from "./create";

function Header() {
  const isOnline = useOnlineStatus()

  return (
    <div className="df draggable px-4 py-2 border-b">
      <ModelSelect />

      {
        !isOnline &&
        <span className=" px-4 py-1 text-xs border border-red-400 text-red-100 rounded-full">
          Offline
        </span>
      }

      <Create />

      {
        isOnline &&
        <Account />
      }
    </div>
  )
}

export default Header
