import { useState } from "react";

import { Node, buildHierarchy } from "../../../../../../utils/build-hierarchy";
import useContextStore from '../../../../../../store/context';
import GetLinks from "./get-links";
import Tree from "./tree";

function Add() {
  const projectId = useContextStore(s => s.project_id)

  const [includedLinks, setIncludedLinks] = useState<string[]>([])
  const [hierarchy, setHierarchy] = useState<Node[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [step, setStep] = useState(1)

  function updateLinks(payload: string[]) {
    const arr = [...new Set([...payload, ...links])]
    const list = buildHierarchy(arr)
    setLinks(payload)
    setHierarchy(list)
    setIncludedLinks(p => [
      ...p,
      ...payload
    ])
    setStep(2)
  }

  function onChecked(v: string) {
    console.log(v)
    setIncludedLinks(p => p.includes(v) ? p.filter(l => l !== v) : [...p, v])
  }

  if (step === 1) {
    return (
      <GetLinks updateLinks={updateLinks} />
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {
        hierarchy.map(h => (
          <Tree
            {...h}
            key={h.url}
            checked={includedLinks}
            onChecked={onChecked}
          />
        ))
      }
    </div>
  )
}

export default Add
