import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { LuX } from 'react-icons/lu';
import axios from 'axios';

import useContextStore from '@store/context';
import useConvoStore from '@store/conversations';
// import useEmbedding from './use-embedding';
import Settings from "./settings";

function Upload() {
  const [loading, setLoading] = useState(false)
  // const { loading, processFile } = useEmbedding()
  const project_id = useContextStore(s => s.project_id)
  const addFile = useConvoStore(s => s.addFile)

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

  const upload = async () => {
    if (file) {
      try {
        console.log(file)
        setLoading(true)
        const formData = new FormData()
        formData.append("files", file)

        const { data } = await axios.post(`http://localhost:4000/doc/index/${project_id}`, formData)
        console.log(data)

        addFile(project_id, {
          id: nanoid(10),
          name: file.name,
          size: file.size,
          type: file.type,
        })
        setLoading(false)
        setFile(null)

      } catch (error) {
        console.log(error)
        setLoading(false)
        setFile(null)
      }
      // processFile({
      //   file,
      //   collectionName: nanoid(),
      //   onSuccess() {
      //     setFile(null)
      //   }
      // })
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

      <Settings />
    </div>
  )
}

export default Upload
