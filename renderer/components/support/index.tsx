import { useState } from 'react';
import axios from 'axios';

import { useToast } from '@/components/ui/use-toast';
import constants from '@/utils/constants';

function Support() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({
    email: "",
    query: "",
    mobile: "",
    videoLink: ""
  })

  const onChange = (key: string, val: string) => {
    setDetails(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const clear = () => {
    setDetails({
      email: "",
      query: "",
      mobile: "",
      videoLink: ""
    })
    setLoading(false)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      await axios.post(`${constants.backendUrl}/support`, details)
      toast({ title: "We will get back to you soon." })
      clear()

    } catch (error) {
      clear()
      console.log(error)
    }
  }

  return (
    <div className="dc flex-1 h-screen px-8">
      <div className="w-full sm:w-[500px] px-6 border rounded-md shadow-md shadow-secondary">
        <h1 className="px-6 py-1.5 -mx-6 border-b">Support</h1>

        <div className="my-6">
          <p className="mb-0.5 text-xs">Email</p>
          <input
            type="email"
            value={details.email}
            onChange={e => onChange("email", e.target.value)}
            className="px-2.5 py-1.5 text-sm bg-input/40"
          />
        </div>

        <div className="my-6">
          <p className="mb-0.5 text-xs">Mobile Number (Optional)</p>
          <input
            type="tel"
            value={details.mobile}
            onChange={e => onChange("mobile", e.target.value)}
            className="px-2.5 py-1.5 text-sm bg-input/40"
          />
        </div>

        <div className="mb-6">
          <p className="mb-0.5 text-xs">Query</p>
          <textarea
            value={details.query}
            onChange={e => onChange("query", e.target.value)}
            className='h-32 pl-3 text-sm bg-input/40 resize-none rounded'
          ></textarea>
        </div>

        <div className="my-6">
          <p className="mb-0.5 text-xs">Video link</p>
          <input
            type="url"
            value={details.videoLink}
            onChange={e => onChange("videoLink", e.target.value)}
            className="px-2.5 py-1.5 text-sm bg-input/40"
          />
        </div>

        <div className="mb-6">
          <button
            className='w-full py-1.5 text-base font-semibold text-primary-foreground bg-primary-dark hover:bg-primary-darker disabled:opacity-60'
            disabled={!details.query || !details.videoLink || !details.email || loading}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Support
