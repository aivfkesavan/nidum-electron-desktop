import { useState } from 'react';
import { LuShieldCheck } from 'react-icons/lu';

import { useSendOTP } from "../../../../hooks/use-user";
import useAuthStore from '../../../../store/auth';
import useUIStore from '../../../../store/ui';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Label } from "../../../ui/label";

import UpdatePass from './update-pass';
import Delete from './delete';
import Reset from './reset';

function Profile() {
  const isVerified = useAuthStore(s => s.isVerified)
  const email = useAuthStore(s => s.email)
  const update = useUIStore(s => s.update)
  const close = useUIStore(s => s.close)

  const { mutate: mutateSendOtp, isPending: isPending1 } = useSendOTP()

  const [showUpdatePass, setShowUpdatePass] = useState(false)

  const updateShowPass = () => setShowUpdatePass(p => !p)

  function sendOtp() {
    mutateSendOtp(email, {
      onSuccess() {
        update({ data: null, open: "verify" })
      }
    })
  }

  function onClose(v: boolean) {
    if (!v) {
      close()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Manage Account</DialogTitle>

          <DialogDescription className='text-zinc-400'>
            Update your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className='df'>
            <Label htmlFor="email" className='text-xs font-normal text-zinc-400'>Email</Label>
            {
              isVerified &&
              <p className='df gap-1 ml-auto text-xs text-green-400'><LuShieldCheck />  Verified</p>
            }
          </div>

          <input
            readOnly
            disabled
            id="email"
            type="email"
            value={email}
            className="px-2.5 py-1.5 text-sm bg-muted cursor-not-allowed"
          />

          {
            !isVerified &&
            <div className='mt-1 text-xs'>
              Your email is not verified.{" "}
              <button
                disabled={isPending1}
                onClick={sendOtp}
                className=' ml-0.5 bg-yellow-400 text-black font-medium'
              >
                Verify now
              </button>
            </div>
          }
        </div>

        {
          !showUpdatePass &&
          <button
            onClick={updateShowPass}
            className='px-4 py-1.5 text-xs bg-zinc-300 text-zinc-800 hover:bg-zinc-200'
          >
            Update Password
          </button>
        }

        {
          showUpdatePass &&
          <UpdatePass
            updateShowPass={updateShowPass}
          />
        }

        <hr className='my-4 bg-zinc-600' />

        <div className="df justify-between">
          <div>
            <h3 className=" font-normal text-zinc-300">Reset App</h3>
            <p className="text-xs text-zinc-400">Erases all app data and initiates a fresh start.</p>
          </div>
          <Reset />
        </div>

        <div className="df justify-between">
          <div>
            <h3 className=" font-normal text-zinc-300">Delete Account</h3>
            <p className="text-xs text-zinc-400">Permanently removes your account along with all associated data.</p>
          </div>

          <Delete />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
