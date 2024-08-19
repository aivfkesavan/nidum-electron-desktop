import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { LuX } from 'react-icons/lu';

import useEmbedding from './use-embedding';

function Upload() {
  const { loading, processFile } = useEmbedding()

  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) return setFile(null)

    const selectedFile = acceptedFiles[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      setFile(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    },
  })

  const upload = () => {
    if (file) {
      processFile({
        file,
        collectionName: nanoid(),
        onSuccess() {
          setFile(null)
        }
      })
    }
  }

  return (
    <div className='flex-1'>
      <h6 className="mb-6 text-sm font-medium text-center text-white/80">Add New File</h6>

      <div
        className="dc flex-col mb-6 py-10 px-8 border rounded-md text-center text-white/60"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <p>{isDragActive ? "Drop the PDF file here..." : "Drag and drop a PDF file here, or click to select a file"}</p>
      </div>

      {
        file &&
        <div className='df justify-between pl-2 py-0.5 hover:bg-secondary rounded-sm'>
          <p>{file?.name?.replace?.(/\\/g, '/')?.split('/')?.pop() || ""}</p>

          <button
            className='p-1 text-foreground hover:bg-red-500 hover'
            onClick={() => setFile(null)}
            disabled={loading}
          >
            <LuX />
          </button>
        </div>
      }

      <button
        className="df px-12 py-1.5 mt-4 mx-auto bg-input hover:bg-input/80"
        onClick={upload}
        disabled={loading || !file}
      >
        {
          loading && <span className='loader-2'></span>
        }
        Upload
      </button>
    </div>
  )
}

export default Upload
