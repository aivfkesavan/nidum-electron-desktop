import { useState } from 'react';
import axios from 'axios';

import { useToast } from '@/components/ui/use-toast';
import constants from '@/utils/constants';

const emojis = [
  {
    title: "bad",
    src: "/bad.png",
  },
  {
    title: "neutral",
    src: "/neutral.png",
  },
  {
    title: "good",
    src: "good.png",
  }
]

const types = [
  "Overall Service",
  "Performace",
  "Transperancy",
  "Customer Support",
  "Service & Efficiency",
  "Other"
]

function Feedback() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({
    type: "",
    email: "",
    emoji: "",
    suggestion: ""
  })

  const onChange = (key: string, val: string) => {
    setDetails(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const clear = () => {
    setDetails({
      type: "",
      email: "",
      emoji: "",
      suggestion: ""
    })
    setLoading(false)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      await axios.post(`${constants.backendUrl}/feedback`, details)
      toast({ title: "Feedback sent successfully" })
      clear()

    } catch (error) {
      clear()
      console.log(error)
    }
  }

  return (
    <div className='dc flex-1 h-screen px-8'>
      <div className='w-full sm:w-[440px] px-6 border rounded-md shadow-md shadow-secondary'>
        <h1 className="px-6 -mx-6 py-1.5 mb-10 border-b">Feedback</h1>
        <div className='mb-6'>
          <label htmlFor="" className='text-xs'>Email</label>
          <input
            type="email"
            className='px-3 text-sm bg-input/40 resize-none rounded'
            value={details.email}
            onChange={e => onChange("email", e.target.value)}
          />
        </div>
        <div className='df justify-center gap-4'>
          {
            emojis.map(e => (
              <button
                key={e.title}
                className={`p-2 rounded-md border shadow-inner shadow-secondary hover:bg-secondary ${e.title === details.emoji ? "bg-secondary border-primary/30" : ""}`}
                onClick={() => onChange("emoji", e.title)}
              >
                <img
                  src={e.src}
                  alt={e.title}
                  className='size-14'
                />
              </button>
            ))
          }
        </div>

        <h5 className='mt-8 mb-4 text-sm font-medium'>Tell us what can be improved?</h5>

        <div className='df flex-wrap'>
          {
            types.map(t => (
              <button
                key={t}
                className={`px-3 py-0.5 text-sm font-light rounded-full border shadow shadow-secondary hover:bg-input/40 ${t === details.type ? "bg-secondary border-primary/30" : ""}`}
                onClick={() => onChange("type", t)}
              >
                {t}
              </button>
            ))
          }
        </div>

        <div className='my-6'>
          <textarea
            className='h-20 p-3 text-sm bg-input/40 resize-none rounded'
            placeholder='Suggestions...'
            value={details.suggestion}
            onChange={e => onChange("suggestion", e.target.value)}
          ></textarea>
        </div>

        <div className='mb-6'>
          <button
            className='w-full py-1.5 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary-darker disabled:opacity-60'
            disabled={!details.emoji || !details.suggestion || !details.type || !details.email || loading}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feedback
