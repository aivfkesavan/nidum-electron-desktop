import { LuSendHorizontal, LuX } from "react-icons/lu";
import { IoMdMic } from "react-icons/io";

import { useConfig } from "../../../../hooks/use-config";
import { useToast } from '../../../../hooks/use-toast';

import transcribeAudio from './transcribe';
import useRecord from './use-record';

type Props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function GroqProvider({ disabled, postData }: Props) {
  const { data: config } = useConfig()
  const sttGroqApiKey = config?.sttGroqApiKey

  const { isRecording, isSupported, onClk, stopRecording } = useRecord()
  const { toast } = useToast()

  const sendAudioTo_STT_API = async (audioBlob: Blob) => {
    const transcript = await transcribeAudio(audioBlob, sttGroqApiKey)
    postData(transcript, true)
  }

  const onClick = () => {
    if (!sttGroqApiKey) return toast({ title: "Groq selected. Please provide the Groq API key." })
    onClk(sendAudioTo_STT_API)
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
            ? <LuSendHorizontal />
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

export default GroqProvider