import { useId, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

import { Node } from "../../../../../../utils/build-hierarchy";

type props = Node & {
  checked: boolean
  onChecked: (url: string, checked: boolean) => void
}

function Tree({ childs, url, fullUrl, checked, onChecked }: props) {
  const [show, setShow] = useState(true)
  const id = useId()

  // const isChecked = checked.includes(fullUrl)

  return (
    <div className="pl-2">
      <div className="df mb-1 text-xs">
        <button
          onClick={() => setShow(p => !p)}
          className="p-0"
        >
          {
            show
              ? <MdArrowDropDown />
              : <MdArrowDropUp />
          }
        </button>

        <input
          id={id}
          type="checkbox"
          value={fullUrl}
          checked={checked}
          onChange={e => onChecked(fullUrl, !checked)}
          className=" w-fit"
        />
        <label htmlFor={id}>
          {url}
        </label>
      </div>

      {
        show && childs.length > 0 &&
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
