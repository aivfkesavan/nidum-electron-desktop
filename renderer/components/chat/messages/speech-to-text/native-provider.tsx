import { LuSendHorizonal } from "react-icons/lu";
import { IoMdMic } from "react-icons/io";
import { LuX } from "react-icons/lu";

import useRecord from "./use-record";
import { convertToWav } from "@utils/audio-help";

type props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function NativeProvider({ disabled, postData }: props) {
  const { isRecording, isSupported, onClk, stopRecording } = useRecord()

  const sendAudioToServer = async (audioBlob: Blob) => {
    const wavBlob = await convertToWav(audioBlob, 16000);
    const formData = new FormData()
    formData.append('audio', wavBlob, 'recording.wav')

    try {
      const response = await fetch('http://localhost:4000/whisper/transcribe/1', {
        method: 'POST',
        body: formData,
      })
      console.log(response)

    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  const onClick = () => {
    // if (!sttGroqApiKey) return toast({ title: "Please provide groq api key" })
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
          <span className='mic-bg-animation absolute w-10 h-10 left-0 top-0 bg-primary rounded-full z-[-1]'></span>
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
