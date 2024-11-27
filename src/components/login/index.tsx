import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useLoginMutate } from "../../hooks/use-user";

import GoogleAuthBtn from "../common/google-btn";
import logo from '../../assets/imgs/logo.png';

function Login() {
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { isPending, mutate } = useLoginMutate()
  const [showPass, setShowPass] = useState(false)

  const updateShowPass = () => setShowPass(p => !p)

  const onSubmit = (data: any) => mutate(data)

  return (
    <section className='dc min-h-screen animate-enter-opacity'>
      <div className="p-8 rounded-3xl bg-[#171717] border border-zinc-700">
        <img
          alt="Nidum logo"
          src={logo}
          className="w-20 mx-auto"
        />

        <h1 className="mt-4 mb-8 text-xl font-semibold text-center">Welcome</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-6">
            <label
              htmlFor="login-email"
              className="text-xs text-zinc-300"
            >
              Email
            </label>
            <input
              type="text"
              id="login-email"
              className="w-72 py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
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
              <div className="mt-0.5 text-xs text-red-400">
                {errors.email.message}
              </div>
            }
          </div>

          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="text-xs"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                id="login-password"
                className="w-72 py-1 text-sm border border-zinc-700 bg-transparent focus-visible:border-zinc-600"
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
              <div className="mt-0.5 text-xs text-red-400">
                {errors.password.message}
              </div>
            }
          </div>

          <button
            type='submit'
            className="w-full py-1.5 text-sm text-zinc-900 bg-zinc-50 hover:opacity-85 disabled:opacity-50"
            disabled={isSubmitting || isPending}
          >
            Log in
          </button>
        </form>

        <div className="mt-1.5 mb-4 text-xs text-right text-zinc-400">
          <Link to="/forget-pass" replace className="text-zinc-300 hover:underline">Forgot Password</Link>
        </div>

        <div className="mb-2 text-xs text-center isolate relative text-zinc-400">
          <span className="absolute top-2 inset-x-0 h-px bg-zinc-700 z-[-1]"></span>
          <span className="px-2 bg-[#171717] z-[1]">Or</span>
        </div>

        <GoogleAuthBtn />

        <div className="mt-6 text-xs text-center text-zinc-400">
          Don't have an account? <Link to="/signup" replace className="text-zinc-300 hover:underline">Sign up</Link>
        </div>
      </div>
    </section>
  )
}

export default Login
