import axios from "axios";

import constants from "@utils/constants";

function Native() {

  async function download() {
    try {
      const { data } = await axios.post(`${constants.backendUrl}/whisper`)

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
