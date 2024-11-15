import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useForm } from 'react-hook-form';

import { resendOtp as resendOtpAction, signup, verifyOtp as verifyOtpAction } from '../../actions/user';
import { useToast } from '../ui/use-toast';

import logo from '../../assets/imgs/logo.png';
import GoogleBtn from '../common/google-btn';

type dataType = { firstName: string, lastName: string, email: string, password: string, otp: string }

function Signup() {
  const { register, formState: { errors, isSubmitting }, handleSubmit, getValues } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      otp: "",
    },
  })

  const [showPass, setShowPass] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const updateShowPass = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowPass(p => !p)
  }

  const verifyOtp = async (data: any) => {
    try {
      await verifyOtpAction({
        email: data?.email,
        otp: Number(data?.otp)
      })
      toast({ title: "Email verified successfully" })
      navigate("/login")

    } catch (error) {
      let hasError = error?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  }

  const resendOtp = async () => {
    try {
      const email = getValues("email")
      await resendOtpAction(email)
      toast({ title: "OTP resended successfully" })

    } catch (error) {
      let hasError = error?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  }

  async function onSubmit(data: dataType) {
    if (showOtp) return verifyOtp(data)

    try {
      const { otp, ...rest } = data

      await signup(rest)
      toast({ title: "Check your email for otp" })
      setShowOtp(true)

    } catch (error) {
      let hasError = error?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  }

  return (
    <section className='dc min-h-screen animate-enter-opacity'>
      <div className='p-8 rounded-3xl bg-[#171717] border border-zinc-700'>
        <img
          alt="Nidum logo"
          src={logo}
          className="w-20 mx-auto"
        />

        <h1 className="mt-4 mb-8 text-xl font-semibold text-center">Welcome to Nidum AI</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className="relative">
              <label
                htmlFor="Signup-name"
                className="text-xs"
              >
                First Name
              </label>

              <input
                type="text"
                id="Signup-name"
                className="w-32 py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
                {...register("firstName", {
                  required: "First Name is required",
                  minLength: {
                    value: 3,
                    message: "Name should be atleast 3 characters"
                  }
                })}
              />

              {
                errors.firstName &&
                <div className="mt-0.5 text-xs text-red-600">
                  {errors.firstName.message}
                </div>
              }
            </div>

            <div className="relative">
              <label
                htmlFor="Signup-lastname"
                className="text-xs"
              >
                Last Name
              </label>

              <input
                type="text"
                id="Signup-lastname"
                className="w-32 py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
                {...register("lastName")}
              />
            </div>
          </div>

          <div className="relative mb-6">
            <label
              htmlFor="Signup-email"
              className="text-xs"
            >
              Email
            </label>

            <input
              type="text"
              id="Signup-email"
              className="py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email"
                },
              })}
            />

            {
              errors.email &&
              <div className="mt-0.5 text-xs text-red-600">
                {errors.email.message}
              </div>
            }
          </div>

          <div className="relative mb-6">
            <label
              htmlFor="Signup-password"
              className="text-xs"
            >
              Password
            </label>

            <div className=' relative'>
              <input
                type={showPass ? "text" : "password"}
                id="Signup-password"
                className="py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
                {...register("password", {
                  required: "Password is required",
                  // pattern: {
                  //   value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                  //   message: "Password must be strong"
                  // }
                })}
              />

              <button
                onClick={updateShowPass}
                className="px-0 absolute top-0.5 right-2 opacity-60 hover:opacity-80"
                type="button"
              >
                {
                  showPass
                    ? <IoEye />
                    : <IoEyeOff />
                }
              </button>
            </div>

            {
              errors.password &&
              <div className="mt-0.5 text-xs text-red-600">
                {errors.password.message}
              </div>
            }
          </div>

          {
            !showOtp &&
            <button
              type='submit'
              className="w-full py-1.5 text-sm text-zinc-900 bg-zinc-50 hover:opacity-85 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Create account
            </button>
          }

          {
            showOtp &&
            <>
              <div className="relative mb-6">
                <label
                  htmlFor="Signup-otp"
                  className="text-xs"
                >
                  OTP
                </label>

                <input
                  type="number"
                  id="Signup-otp"
                  className="no-number-arrows py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
                  {...register("otp", {
                    required: "OTP is required",
                  })}
                />

                {
                  errors.otp &&
                  <div className="mt-0.5 text-xs text-red-600">
                    {errors.otp.message}
                  </div>
                }
              </div>

              <button
                type='submit'
                className="w-full py-1.5 text-sm text-zinc-900 bg-zinc-50 hover:opacity-85 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Verify OTP
              </button>

              <button
                type="button"
                className='block ml-auto mt-1 p-0 text-xs text-primary hover:underline'
                onClick={resendOtp}
              >
                Resend OTP
              </button>
            </>
          }
        </form>

        {
          !showOtp &&
          <>
            <div className="mt-5 text-xs text-center isolate relative text-zinc-400">
              <span className="absolute top-2 inset-x-0 h-px bg-zinc-700 z-[-1]"></span>
              <span className="px-2 bg-[#171717] z-[1]">Or</span>
            </div>

            <GoogleBtn />

            <div className="mt-5 text-xs text-center text-zinc-400">
              Already have an account? <Link to="/login" replace className="text-zinc-300 hover:underline">Log in</Link>
            </div>
          </>
        }
      </div>
    </section>
  )
}

export default Signup
