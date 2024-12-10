import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { useLLamaDownloadedModels, useUploadModel } from '../../../hooks/use-llm-models';
import { bytesToSize } from '../../../utils';
import { useToast } from '../../../hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

type dataT = {
  name: string
  description: string
  file: File | null
}
function UploadLocalLlm() {
  const { data: downloaded } = useLLamaDownloadedModels("downloaded")
  const [open, setOpen] = useState(false)

  const { register, formState: { errors }, setValue, watch, reset, handleSubmit } = useForm<dataT>({
    defaultValues: {
      name: "",
      description: "",
      file: null,
    }
  })

  const selectedFile = watch("file")
  const { toast } = useToast()

  const acceptedFileTypes = {
    'application/octet-stream': ['.gguf']
  }

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) return;
    if (acceptedFiles.length > 0) {
      setValue("file", acceptedFiles[0], { shouldValidate: true })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false
  })

  const { mutate, isPending } = useUploadModel()

  const removeFile = () => setValue("file", null)

  function onSubmit(data: dataT) {
    if (downloaded?.some((d: any) => d?.fileName === data?.file?.name)) {
      return toast({ title: "Model already exists." })
    }

    const formData = new FormData()
    formData.append("model", data?.file)
    formData.append("name", data?.name)
    formData.append("description", data?.description)
    formData.append("size", bytesToSize(data?.file?.size))
    mutate(formData, {
      onSuccess() {
        closeModel(false)
      }
    })
  }

  function closeModel(v: boolean) {
    if (!v) reset()
    setOpen(v)
  }

  return (
    <Dialog open={open} onOpenChange={closeModel}>
      <DialogTrigger className='block ml-auto mt-4 text-xs font-medium text-zinc-600 bg-zinc-300 hover:bg-zinc-300/80'>
        Upload LLM
      </DialogTrigger>

      <DialogContent className='max-w-md border-zinc-600'>
        <DialogHeader>
          <DialogTitle>Upload LLM</DialogTitle>
          <DialogDescription>Provide details about the model you want to upload</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Name</label>
            <input
              type="text"
              className="px-2.5 py-1.5 text-sm bg-transparent border"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {
              errors.name &&
              <p className='text-xs text-red-400'>{errors?.name?.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">Description</label>
            <textarea
              className="h-20 px-2.5 py-1.5 text-sm bg-transparent border resize-none"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 200,
                  message: "Maximum 200 charcters only allowed"
                }
              })}
            />
            {
              errors.description &&
              <p className='text-xs text-red-400'>{errors.description.message}</p>
            }
          </div>

          <div className='mb-6'>
            <label htmlFor="" className="mb-0.5 text-xs">File</label>

            {
              !selectedFile ? (
                <div
                  className="dc flex-col py-10 px-8 text-xs border rounded-md text-center text-zinc-300"
                  {...getRootProps()}
                >
                  <input
                    {...register("file", {
                      required: "File is required",
                      validate: (file) => file !== null || "File is required",
                    })}
                    {...getInputProps({ accept: ".gguf" })}
                  />

                  <p>{isDragActive ? "Drop the file here..." : "Drag and Drop or Click to Upload .gguf file"}</p>
                </div>
              )
                : (
                  <div className="df pl-4 pr-2 py-2 border rounded-md">
                    <span className="flex-1 line-clamp-1 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-xs font-medium text-red-300 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                )
            }

            {errors.file &&
              <p className="text-xs text-red-400">{errors?.file?.message}</p>
            }
          </div>

          <button
            className='df mx-auto py-1.5 px-6 text-sm font-medium rounded-full bg-input hover:bg-input/70 disabled:opacity-60'
            disabled={isPending}
          >
            {isPending && <span className='loader-2 size-4 border-2'></span>}
            Upload LLM
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadLocalLlm
