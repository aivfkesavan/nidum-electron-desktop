
import { useNidumChainSetupStatus } from "../../../../hooks/use-device";

import TryAgain from "./try-again";
import Invite from "./invite";
import Main from "./main";
import Configurations from "./configurations";

function GoPublic() {
  const { data: chainSetupStatus, isLoading } = useNidumChainSetupStatus()

  if (isLoading) {
    return <div className="dc h-60"><span className="loader-2 size-4 border-2"></span></div>
  }

  if (!chainSetupStatus?.["nidum-chain-url-config"] || !chainSetupStatus?.["nidum-chain-enable"] || !chainSetupStatus?.["nidum-chain-reserve"]) {
    return <TryAgain />
  }

  return (
    <>
      <div className="p-6 m-4 rounded-lg border shadow shadow-zinc-800">
        <Main />
        <Invite />
      </div>
      <Configurations />
    </>
  )
}

export default GoPublic
