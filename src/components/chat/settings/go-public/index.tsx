import { useState } from "react";
import { LuX } from "react-icons/lu";

function GoPublic() {
  const [emailTo, setEmailTo] = useState("")

  return (
    <div className="">
      {
        // <div className="text-xs text-center">Adding this system to your list of registered servers</div>
      }

      <div className="dc mb-8">
        <input
          className=" max-w-60 px-3 py-2 text-sm bg-zinc-700/50"
        />

        <button
          className={`dc w-36 px-4 py-1.5 text-[13px] ${false ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {/* <span className="loader-2 size-4 border-2"></span> */}
          {false ? "Stop Sharing" : "Go Public"}
        </button>
      </div>

      <div className="dc text-xs">
        <p className="shrink-0">Invite a friend</p>
        <input
          type="email"
          className="w-full max-w-[280px] px-2.5 py-1.5 bg-zinc-700/30"
          placeholder="john@gmail.com"
          value={emailTo}
          onChange={e => setEmailTo(e.target.value)}
        />
        <button
          className="px-2 py-1 bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
          disabled={!emailTo}
          onClick={() => {
            setEmailTo("")
          }}
        >
          Invite
        </button>
      </div>

      <div className="max-w-md mt-8 w-full mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]?.map(l => (
          <div
            key={l}
            className="df pl-2 mb-1 text-sm hover:bg-zinc-700/50 rounded-sm"
          >
            <p className="flex-1">examolbjkdc@vkhdceyv.vuycdw{l}</p>
            <button
              className="p-1 hover:bg-red-500"
            >
              <LuX />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoPublic
