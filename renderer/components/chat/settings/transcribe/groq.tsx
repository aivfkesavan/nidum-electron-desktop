import useContextStore from "@/store/context";

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const sttGroqApiKey = useContextStore(s => s.sttGroqApiKey)

  return (
    <div>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Groq api key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={sttGroqApiKey}
          onChange={e => updateContext({ sttGroqApiKey: e.target.value })}
        />
      </div>

      <div className="mt-6 text-xs text-white/60">
        Click here to sign up for a Groq developer account: <a href="https://console.groq.com/login" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
      </div>
    </div>
  )
}

export default Groq
