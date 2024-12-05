import { useState } from "react";
import { LuRefreshCw, LuWifi } from 'react-icons/lu';

function TryAgain() {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setTimeout(() => {
      setIsRetrying(false)
    }, 2000)
  }

  return (
    <div className="pt-6">
      <div className="bg-zinc-800 rounded">
        <div className="dc py-4">
          <LuWifi className="text-4xl text-zinc-300" />
        </div>

        <div className="p-6 pt-8 rounded-t-3xl bg-zinc-700/30">
          <p className="mb-4 text-center text-lg font-semibold text-zinc-100">
            Connecting to Nidum
          </p>

          <p className="mb-4 text-sm text-center text-zinc-300">
            We're working on establishing a connection between your local network and the Nidum chain. Sometimes this
            can take a moment. Feel free to try again, and we'll do our best to get you connected.
          </p>

          <button
            className="dc mx-auto px-4 py-1 text-sm rounded-full bg-zinc-700 text-white hover:bg-zinc-700/50 relative group"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <LuRefreshCw className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TryAgain
