import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { useProjectById, useProjectMutate } from '../../../hooks/use-project';
import { systemDefaultPrompt } from '../../../utils/improve-context';
import useUIStore from '../../../store/ui';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const list = [
  "General",
  "Research",
  "Education",
  "Programming",
  "Customer Support",
  "Creative Writing",
  "Development",
  "Marketing",
  "Learning",
  "Hobby",
  "Other"
]

function Project() {
  const closeModel = useUIStore(s => s.close)
  const open = useUIStore(s => s.open)
  const project_id = useUIStore(s => s?.data?._id)

  const { data: project } = useProjectById(project_id)

  const { register, reset, control, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      other: "",
      category: "",
      description: "",
      systemPrompt: systemDefaultPrompt,
    }
  })

  const category = useWatch({
    control,
    name: "category",
  })

  const { mutate, isPending } = useProjectMutate()

  useEffect(() => {
    if (project) {
      reset({
        name: project?.name,
        other: project?.other,
        category: project?.category,
        description: project?.description,
        systemPrompt: project?.systemPrompt,
      })
    }
  }, [project])

  const onSubmit = (payload: any) => {
    const final = { ...payload }
    if (project_id) {
      final._id = project_id
    }

    mutate(final, {
      onSuccess() {
        closeModel()
      }
    })
  }

  return (
    <Dialog open={open === "project"} onOpenChange={closeModel}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{project_id ? "Edit" : "Create"} Project</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Name</label>
            <input
              type="text"
              className="px-2.5 py-1.5 text-sm bg-transparent border"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 charcters need to be filled"
                }
              })}
            />
            {
              errors.name &&
              // @ts-ignore
              <p className='text-xs text-red-400'>{errors?.name?.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Category</label>
            <Controller
              name="category"
              control={control}
              rules={{
                required: "Category is required"
              }}
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {
                      list.map(l => (
                        <SelectItem
                          key={l}
                          value={l}
                        >
                          {l}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              )}
            />
            {
              errors.category &&
              // @ts-ignore
              <p className='text-xs text-red-400'>{errors.category.message}</p>
            }
          </div>

          {
            category === "Other" &&
            <div className='mb-6'>
              <label htmlFor="" className="mb-0.5 text-xs">Other's Name</label>
              <input
                type="text"
                className='px-2.5 py-1.5 text-sm bg-transparent border'
                maxLength={20}
                {...register("other", {
                  required: "Other's Name is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 charcters need to be filled"
                  }
                })}
              />
              {
                errors?.other &&
                // @ts-ignore
                <p className='text-xs text-red-400'>{errors?.other?.message}</p>
              }
            </div>
          }

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Description</label>
            <textarea
              className="h-20 px-2.5 py-1.5 text-sm bg-transparent border resize-none"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 15,
                  message: "Minimum 15 charcters need to be filled"
                }
              })}
            />
            {
              errors.description &&
              // @ts-ignore
              <p className='text-xs text-red-400'>{errors.description.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">System Prompt</label>
            <textarea
              className="h-20 px-2.5 py-1.5 text-sm bg-transparent border resize-none"
              {...register("systemPrompt")}
            />
          </div>

          <button
            className='block mx-auto py-1.5 px-6 text-sm font-medium rounded-full bg-input hover:bg-input/70 disabled:opacity-60'
            disabled={isPending}
          >
            {project_id ? "Edit" : "Create"} Project
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Project
