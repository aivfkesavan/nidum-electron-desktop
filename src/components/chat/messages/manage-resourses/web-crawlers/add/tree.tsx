import { useId } from "react"
import { Node } from "../../../../../../utils/build-hierarchy"

type props = Node & {
  checked: string[]
  onChecked: (v: string) => void
}

function Tree({ childs, url, fullUrl, checked, onChecked }: props) {
  const id = useId()
  return (
    <div className="pl-2">
      <div className="df mb-1 text-xs">
        <input
          id={id}
          type="checkbox"
          value={fullUrl}
          checked={checked.includes(fullUrl)}
          onChange={e => onChecked(e.target.value)}
          className=" w-fit"
        />
        <label htmlFor={id}>
          {url}
        </label>
      </div>

      {
        childs.map(l => (
          <Tree
            {...l}
            key={l.url}
            checked={checked}
            onChecked={onChecked}
          />
        ))
      }
    </div>
  )
}

export default Tree
