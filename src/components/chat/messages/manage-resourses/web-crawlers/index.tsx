import List from "./list";
import Add from "./add";

function WebCrawlers() {
  return (
    <div className='flex flex-col md:flex-row gap-8'>
      <Add />
      <List />
    </div>
  )
}

export default WebCrawlers
