import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { useFogetPassMutate } from '../../hooks/use-user';

import logo from '../../assets/imgs/logo.png';

function ForgetPass() {
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  })

  const { isPending, mutate } = useFogetPassMutate()

  function onSubmit(data: { email: string }) {
    mutate(data.email)
  }

  return (
    <section className='dc min-h-screen animate-enter-opacity'>
      <div className="p-8 rounded-3xl bg-[#171717] border border-zinc-700">
        <img
          alt="Nidum logo"
          src={logo}
          className="w-20 mx-auto"
        />

        <h1 className="mt-4 mb-8 text-xl font-semibold text-center">Recover Password</h1>

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

          <button
            type='submit'
            className="w-full py-1.5 text-sm text-zinc-900 bg-zinc-50 hover:opacity-85 disabled:opacity-50"
            disabled={isSubmitting || isPending}
          >
            Submit
          </button>
        </form>

        <div className="mb-6 mt-4 text-xs text-center text-zinc-400">
          Remember your login credencials? <Link to="/login" replace className="text-zinc-300 hover:underline">Login</Link>
        </div>
      </div>
    </section>
  )
}

export default ForgetPass
