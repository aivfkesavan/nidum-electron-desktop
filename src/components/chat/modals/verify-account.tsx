import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

import { useSendOTP, useVerifyEmail } from "../../../hooks/use-user";
import useAuthStore from "../../../store/auth";
import useUIStore from "../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../components/ui/input-otp";

function VerifyAccount() {
  const closeModel = useUIStore(s => s.close)
  const open = useUIStore(s => s.open)

  const email = useAuthStore(s => s.email)
  const [otp, setOtp] = useState("")

  const { mutate: mutateSendOtp, isPending: isPending1 } = useSendOTP()
  const { mutate: mutateVerify, isPending } = useVerifyEmail()

  function verify() {
    mutateVerify({ email, otp: Number(otp) }, {
      onSuccess() {
        closeModel()
      }
    })
  }

  return (
    <Dialog open={open === "verify"} onOpenChange={closeModel}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Verify account</DialogTitle>
          <DialogDescription>Check your email for OTP</DialogDescription>
        </DialogHeader>

        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <button
          disabled={isPending1}
          onClick={() => mutateSendOtp(email)}
          className="p-0 -mt-3 text-xs hover:underline hover:bg-transparent"
        >
          Resend OTP
        </button>

        <DialogFooter>
          <button
            className="px-3 py-1.5 text-sm bg-input hover:bg-input/70"
            onClick={closeModel}
          >
            Cancel
          </button>

          <button
            disabled={isPending || otp?.length < 6}
            onClick={verify}
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
          >
            Verify
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyAccount
