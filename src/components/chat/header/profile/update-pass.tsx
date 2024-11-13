import { useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useForm } from 'react-hook-form';

import { Label } from "../../../ui/label";
import { useUpdatePassMutate } from '../../../../hooks/use-user';

type updatePass = { oldPassword: string, newPassword: string }

type props = {
  updateShowPass: () => void
}

function UpdatePass({ updateShowPass }: props) {
  const { register, formState: { errors }, handleSubmit } = useForm<updatePass>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    }
  })

  const { mutate, isPending } = useUpdatePassMutate()

  const [showPass1, setShowPass1] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const updateShowPass1 = () => setShowPass1(p => !p)
  const updateShowPass2 = () => setShowPass2(p => !p)

  const onSubmit = (data: updatePass) => {
    mutate(data, {
      onSettled() {
        updateShowPass()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-4'>
        <Label className='text-xs font-normal text-zinc-400' htmlFor="current-password">Current Password</Label>

        <div className="relative">
          <input
            id="current-password"
            type={showPass1 ? "text" : "password"}
            {...register("oldPassword", {
              required: "Old Password is required",
              // pattern: {
              //   value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
              //   message: "Password must be strong"
              // }
            })}
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

        {
          errors.oldPassword &&
          <div className="mt-0.5 text-xs text-red-400">
            {errors.oldPassword.message}
          </div>
        }
      </div>

      <div className='mb-4'>
        <Label className='text-xs font-normal text-zinc-400' htmlFor="new-password">New Password</Label>

        <div className='relative'>
          <input
            id="new-password"
            type={showPass2 ? "text" : "password"}
            {...register("newPassword", {
              required: "New Password is required",
              // pattern: {
              //   value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
              //   message: "Password must be strong"
              // }
            })}
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

        {
          errors.newPassword &&
          <div className="mt-0.5 text-xs text-red-400">
            {errors.newPassword.message}
          </div>
        }
      </div>

      <button
        type="submit"
        disabled={isPending}
        className='px-4 py-1.5 text-xs bg-zinc-300 text-zinc-800 hover:bg-zinc-200'
      >
        Update Password
      </button>
    </form>
  )
}

export default UpdatePass
