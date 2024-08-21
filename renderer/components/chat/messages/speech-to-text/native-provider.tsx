import { LuSendHorizonal } from "react-icons/lu";
import { IoMdMic } from "react-icons/io";
import { LuX } from "react-icons/lu";

import { convertToWav } from "@utils/audio-help";
import useContextStore from "@store/context";
import { useToast } from "@components/ui/use-toast";
import useRecord from "./use-record";
import constants from "@utils/constants";

type props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function NativeProvider({ disabled, postData }: props) {
  const nativeSttModel = useContextStore(s => s.nativeSttModel)

  const { isRecording, isSupported, onClk, stopRecording } = useRecord()
  const { toast } = useToast()

  const sendAudioToServer = async (audioBlob: Blob) => {
    const wavBlob = await convertToWav(audioBlob, 16000);
    const formData = new FormData()
    formData.append('audio', wavBlob, 'recording.wav')

    try {
      const response = await fetch(`${constants.backendUrl}/whisper/transcribe/audio`, {
        method: 'POST',
        body: formData,
      })
      const res = await response.json()

      if (res.transcriped) {
        postData(res.transcriped, true)
      }

    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  const onClick = () => {
    if (!nativeSttModel) return toast({ title: "Please select whisper model" })
    onClk(sendAudioToServer)
  }

  if (!isSupported) return null

  return (
    <div className='relative'>
      <button
        className={`dc w-10 h-10 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input z-[1] ${isRecording ? "text-primary-darker" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {
          isRecording
            ? <LuSendHorizonal />
            : <IoMdMic className=' text-white/60' />
        }
      </button>

      {isRecording && (
        <>
          <span className='mic-bg-animation absolute w-10 h-10 left-0 top-0 bg-blue-400 rounded-full z-[-1]'></span>
          <button
            className='dc w-7 h-7 p-0 absolute -top-8 left-1.5 animate-enter-opacity text-base rounded-full text-white bg-red-400'
            onClick={() => stopRecording(false)}
          >
            <LuX />
          </button>
        </>
      )}
    </div>
  )
}

export default NativeProvider
