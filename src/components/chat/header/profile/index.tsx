import { useState } from 'react';

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
  const email = useAuthStore(s => s.email)
  const close = useUIStore(s => s.close)

  const [showUpdatePass, setShowUpdatePass] = useState(false)

  const updateShowPass = () => setShowUpdatePass(p => !p)

  function onClose(v: boolean) {
    if (!v) {
      close()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>

          <DialogDescription className='text-zinc-400'>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="email" className='text-xs font-normal text-zinc-400'>Email</Label>
          <input
            readOnly
            disabled
            id="email"
            type="email"
            value={email}
            className="px-2.5 py-1.5 text-sm bg-muted cursor-not-allowed"
          />
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
            <p className="text-xs text-zinc-400">Clear all app data and start fresh</p>
          </div>
          <Reset />
        </div>

        <div className="df justify-between">
          <div>
            <h3 className=" font-normal text-zinc-300">Delete Account</h3>
            <p className="text-xs text-zinc-400">Permanently remove your account and all data</p>
          </div>

          <Delete />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
