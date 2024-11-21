import { useState } from "react";

type props = {
  src: string
}

function Image({ src }: props) {
  const [error, setError] = useState(false)

  const handleError = () => setError(true)

  if (error) return <span className="size-4 bg-gray-700 rounded-full"></span>

  return (
    <img
      src={src}
      onError={handleError}
      className="size-4 rounded-full"
    />
  )
}

export default Image
