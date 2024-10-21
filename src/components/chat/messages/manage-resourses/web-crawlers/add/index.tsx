import { useState } from "react";

import { Node, buildHierarchy } from "../../../../../../utils/build-hierarchy";
import useContextStore from '../../../../../../store/context';
import GetLinks from "./get-links";
import { useMutation } from "@tanstack/react-query";
import { crawleWeb } from "../../../../../../actions/webcrawler";
// import Tree from "./tree";

type hierarchyT = Node & {
  checked: boolean
}
function Add() {
  const projectId = useContextStore(s => s.project_id)

  const [includedLinks, setIncludedLinks] = useState<string[]>([])
  // const [hierarchy, setHierarchy] = useState<hierarchyT[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [step, setStep] = useState(1)

  const { mutate, isPending } = useMutation({
    mutationFn: crawleWeb,
  })

  function updateLinks(payload: string[]) {
    // const arr = [...new Set([...payload, ...links])]
    // const list = buildHierarchy(arr)
    setLinks(p => [...p, ...payload])
    setIncludedLinks(p => [...p, ...payload])

    // setHierarchy(list.map(l => ({
    //   ...l,
    //   checked: includedLinks.includes(l.fullUrl) || payload.includes(l.fullUrl),
    // })))
    // setIncludedLinks(p => [
    //   ...p,
    //   ...payload
    // ])
    setStep(2)
  }

  // function updateIncludedLinks(node: Node, checked: boolean, currentLinks: string[]): string[] {
  //   const updatedLinks = checked
  //     ? [...new Set([...currentLinks, node.fullUrl])]
  //     : currentLinks.filter(link => link !== node.fullUrl)

  //   return node.childs.reduce(
  //     (acc, child) => updateIncludedLinks(child, checked, acc),
  //     updatedLinks
  //   )
  // }

  // function childCheck(list: hierarchyT, url: string, checked: boolean) {
  //   if (url.includes(list.fullUrl)) {
  //     const isCheked = !checked || true

  //     return {
  //       ...list,
  //     }
  //   }
  //   return list
  // }

  // function onChecked(url: string, checked: boolean) {
  //   setHierarchy(prev => {
  //     let newArr = prev.map(p => {
  //       if (url.includes(p.fullUrl)) {
  //         return {
  //           ...p,
  //           checked,

  //         }
  //       }
  //       return p
  //     })
  //     return newArr
  //   })
  //   setIncludedLinks(p => checked ? [...p, url] : p.filter(f => f !== url))
  // }

  if (step === 1) {
    return (
      <GetLinks updateLinks={updateLinks} />
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {
        links.map(l => (
          <div key={l} className="df">
            <input
              type="checkbox"
              className="w-fit"
              value={l}
              id={l}
              checked={includedLinks.includes(l)}
              onChange={() => setIncludedLinks(prev => includedLinks.includes(l) ? prev.filter(p => p !== l) : [...prev, l])}
            />
            <label htmlFor={l}>{l}</label>
          </div>
        ))
      }

      <button
        onClick={() => mutate({ urls: includedLinks, folderName: projectId })}
        disabled={isPending}
      >
        Crawle it
      </button>

      {/* {
        hierarchy.map(h => (
          <Tree
            {...h}
            key={h.url}
            onChecked={onChecked}
          />
        ))
      } */}
    </div>
  )
}

export default Add
