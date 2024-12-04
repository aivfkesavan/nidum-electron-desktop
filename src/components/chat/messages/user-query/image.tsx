import { useEffect, useState } from 'react';

import { Skeleton } from '../../../../components/ui/skeleton';

type props = {
  src: string
}

function Image({ src }: props) {
  const [error, setError] = useState(false)

  useEffect(() => {
    let id = null
    if (error) {
      id = setTimeout(() => {
        setError(false)
      }, 6000)
    }

    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [error])

  const handleError = () => setError(true)

  if (error) return <Skeleton className="w-full h-60 bg-zinc-700 rounded-md" />

  return (
    <img
      className="w-full h-60 object-cover rounded-md"
      onError={handleError}
      src={src}
      alt=""
    />
  )
}

export default Image
