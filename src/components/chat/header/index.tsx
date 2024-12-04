import OfflineIndicator from "./offline-indicator";
import ModelSelect from "./model-select";
import Account from "./account";
import Create from "./create";

function Header() {
  return (
    <div className="df draggable px-4 py-2 border-b">
      <ModelSelect />
      <OfflineIndicator />
      <Create />
      <Account />
    </div>
  )
}

export default Header
