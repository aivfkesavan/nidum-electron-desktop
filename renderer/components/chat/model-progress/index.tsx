import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { LuX } from "react-icons/lu";

import useStreamingFetch from "./use-stream-fetch";
import useModelStore from "@store/model";

function ModelProgress() {
  const name = useModelStore(s => s.name)

  const [show, setShow] = useState(true)

  const data = useStreamingFetch()

  const updateShow = () => setShow(p => !p)

  return (
    <>
      <button
        className="dc size-8 p-0 shrink-0 text-lg text-white/60 rounded-full cursor-pointer bg-input"
        onClick={updateShow}
      >
        <FiDownload className="animate-pulse" />
      </button>

      {
        show &&
        <div className="df w-60 px-3 py-2 fixed top-12 right-4 rounded-md bg-input/90 backdrop-blur-sm z-[500]">
          <p className="text-xs truncate text-white/80">{name}</p>
          <p className="pr-8 text-xs">{data}%</p>

          <button
            className="p-0.5 absolute top-0.5 right-0.5 text-white/50 hover:bg-black/50 hover:text-white"
            onClick={updateShow}
          >
            <LuX />
          </button>
        </div>
      }
    </>
  )
}

export default ModelProgress
