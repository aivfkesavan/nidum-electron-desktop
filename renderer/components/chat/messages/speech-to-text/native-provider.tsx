import { useEffect, useRef, useState } from 'react';
import { LuSendHorizonal } from "react-icons/lu";
import { IoMdMic } from "react-icons/io";
import { LuX } from "react-icons/lu";

import { useAudioStore } from '../use-speech';

type props = {
  disabled: boolean
  postData: (s: string, v: boolean) => void
}

function NativeProvider({ disabled, postData }: props) {
  const update = useAudioStore(u => u.update)

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldPostRef = useRef(false)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    // recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      setTranscript(currentTranscript)
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (shouldPostRef.current) {
      shouldPostRef.current = false
      postData(transcript, true)
      setTranscript("")
    }
  }, [transcript, postData])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const stopAndPostMessage = () => {
    if (recognitionRef.current) {
      update({ needAutoPlay: true })
      recognitionRef.current.stop()
      setIsListening(false)
      shouldPostRef.current = true
    }
  }

  const onClk = () => {
    if (isListening) return stopAndPostMessage()
    startListening()
  }

  return (
    <div className='relative'>
      <button
        className={`dc w-10 h-10 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input z-[1] ${isListening ? "text-primary-darker" : ""}`} onClick={onClk}
        disabled={disabled}
      >
        {
          isListening
            ? <LuSendHorizonal />
            : <IoMdMic className=' text-white/60' />
        }
      </button>

      {
        isListening &&
        <>
          <span className='mic-bg-animation absolute w-10 h-10 left-0 top-0 bg-primary rounded-full z-[-1]'></span>

          <button
            className='dc w-7 h-7 p-0 absolute -top-8 left-1.5 animate-enter-opacity text-base rounded-full text-white bg-red-400'
            onClick={stopListening}
          >
            <LuX />
          </button>
        </>
      }
    </div>
  )
}

export default NativeProvider
