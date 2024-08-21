import axios from "axios"

function Native() {

  async function download() {
    try {
      const { data } = await axios.post("http://localhost:4000/whisper")

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button className="" onClick={download}>
        Download
      </button>
    </div>
  )
}

export default Native
