import { useEffect, useState } from 'react';
import { LuSendHorizonal, LuX } from "react-icons/lu";
import { IoMdMic } from "react-icons/io";

import { useAudioStore } from '../use-speech';
import useContextStore from '@/store/context';
import { useToast } from '@/components/ui/use-toast';

import { mediaRecorderService } from './MediaRecorderService';
import transcribeAudio from './transcribe';

type Props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function GroqProvider({ disabled, postData }: Props) {
  const sttGroqApiKey = useContextStore(s => s.sttGroqApiKey)
  const update = useAudioStore(u => u.update)

  const { toast } = useToast()

  const [isSupported, setIsSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const isBrowserSupported = () => {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }

    const willRecordingWork = isBrowserSupported()
    setIsSupported(willRecordingWork)

    return () => {
      if (isRecording) {
        mediaRecorderService.cancelRecording().catch((e: any) => {
          console.log(e)
        })
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      await mediaRecorderService.startRecording()
      setIsRecording(true)

    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = async (needTranscribe: boolean) => {
    if (!needTranscribe) {
      mediaRecorderService.stopRecording()
      setIsRecording(false)
      return
    }

    try {
      const audioBlob = await mediaRecorderService.stopRecording()
      setIsRecording(false)
      sendAudioTo_STT_API(audioBlob)

    } catch (error) {
      console.error('Error stopping recording:', error)
      setIsRecording(false)
    }
  }

  const sendAudioTo_STT_API = async (audioBlob: Blob) => {
    const transcript = await transcribeAudio(audioBlob)
    postData(transcript, true)
  }

  const onClk = () => {
    if (!sttGroqApiKey) return toast({ title: "Please provide groq api key" })

    if (isRecording) {
      stopRecording(true)
      update({ needAutoPlay: true })
    } else {
      startRecording()
    }
  }

  if (!isSupported) return null

  return (
    <div className='relative'>
      <button
        className={`dc w-10 h-10 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input z-[1] ${isRecording ? "text-primary-darker" : ""}`}
        onClick={onClk}
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

export default GroqProvider