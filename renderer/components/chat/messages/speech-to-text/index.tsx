
import useSttValidCheck from "@/hooks/use-stt-valid-check";
import useContextStore from "@/store/context";

import NativeProvider from "./native-provider";
import GroqProvider from "./grog-provider";

type props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function SpeechToText({ disabled, postData }: props) {
  const stt_type = useContextStore(s => s.stt_type)
  const isSupported = useSttValidCheck()

  async function get() {
    try {
      const query = "summersie the document"
      const res = await fetch(`http://localhost:4000/doc?query=${query}`, {
        method: "GET",
      })
      const g = await res.json()
      console.log(g)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button onClick={get}>
      hi
    </button>
  )

  if (!isSupported) return null

  return stt_type === "Groq" ? (
    <GroqProvider
      postData={postData}
      disabled={disabled}
    />
  ) : (
    <NativeProvider
      postData={postData}
      disabled={disabled}
    />
  )
}

export default SpeechToText
