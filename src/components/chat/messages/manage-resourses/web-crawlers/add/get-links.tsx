import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { getSubLinks } from '../../../../../../actions/webcrawler';

type props = {
  updateLinks: (v: string[]) => void
}

function GetLinks({ updateLinks }: props) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      url: "https://crawlee.dev",
      maxRequestsPerCrawl: 4,
    }
  })

  const { isPending, mutate } = useMutation({
    mutationFn: getSubLinks,
    onSuccess(res) {
      updateLinks(res.links)
    }
  })

  const onSubmit = (data: any) => mutate(data)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex-1 text-xs'
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium text-white/80">Crawle New Website</label>

        <input
          type="url"
          className=" bg-input/70"
          placeholder="https://example.com"
          {...register("url", {
            required: "Website URL is required",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Enter a valid URL starting with http:// or https://"
            }
          })}
        />
        {errors.url && <p className="text-red-500 mt-1">{errors.url.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-white/80">No. of Sub Pages</label>

        <input
          className=" bg-input/70"
          placeholder="4"
          {...register("maxRequestsPerCrawl", {
            valueAsNumber: true,
            required: "Number of sub pages is required",
            min: { value: 1, message: "Minimum value is 1" },
            max: { value: 100, message: "Maximum value is 100" }
          })}
        />
        {errors.maxRequestsPerCrawl && <p className="text-red-500 mt-1">{errors.maxRequestsPerCrawl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="df px-12 py-1.5 mt-4 mx-auto bg-input hover:bg-input/80"
      >
        {isPending && <span className='loader-2'></span>}
        Get Links
      </button>
    </form>
  )
}

export default GetLinks
