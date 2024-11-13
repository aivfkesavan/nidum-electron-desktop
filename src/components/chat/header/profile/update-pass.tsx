import { useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";

import { Label } from "../../../ui/label";

function UpdatePass() {
  const [newPassword, setNewPassword] = useState('')
  const [showPass1, setShowPass1] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [password, setPassword] = useState('')

  const updateShowPass1 = () => setShowPass1(p => !p)
  const updateShowPass2 = () => setShowPass2(p => !p)

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setPassword('')
    setNewPassword('')
  }

  return (
    <form onSubmit={handlePasswordUpdate}>
      <div className='mb-4'>
        <Label className='text-xs font-normal text-zinc-400' htmlFor="current-password">Current Password</Label>

        <div className="relative">
          <input
            id="current-password"
            type={showPass1 ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2.5 py-1.5 text-sm bg-[#171717]"
          />

          <button
            onClick={updateShowPass1}
            className="px-0 absolute top-1 right-2 opacity-60 hover:opacity-80"
            type="button"
          >
            {
              showPass1
                ? <IoEye />
                : <IoEyeOff />
            }
          </button>
        </div>
      </div>

      <div className='mb-4'>
        <Label className='text-xs font-normal text-zinc-400' htmlFor="new-password">New Password</Label>

        <div className='relative'>
          <input
            id="new-password"
            type={showPass2 ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="px-2.5 py-1.5 text-sm bg-[#171717]"
          />

          <button
            onClick={updateShowPass2}
            className="px-0 absolute top-1 right-2 opacity-60 hover:opacity-80"
            type="button"
          >
            {
              showPass2
                ? <IoEye />
                : <IoEyeOff />
            }
          </button>
        </div>
      </div>

      <button
        className='px-4 py-1.5 text-xs bg-zinc-300 text-zinc-800 hover:bg-zinc-200'
      >
        Update Password
      </button>
    </form>
  )
}

export default UpdatePass
