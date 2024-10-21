import { useState } from "react";

import { sortUrlsByPathname } from "../../../../../../utils/url-helper";
import useContextStore from '../../../../../../store/context';
import { useAddCrawl } from "../../../../../../hooks/use-crawler";

import GetLinks from "./get-links";

function Add() {
  const projectId = useContextStore(s => s.project_id)

  const [includedLinks, setIncludedLinks] = useState<string[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [step, setStep] = useState(1)

  const { mutate, isPending } = useAddCrawl()

  function updateLinks(payload: string[]) {
    setLinks(p => sortUrlsByPathname([...new Set([...p, ...payload])]))
    setIncludedLinks(p => [...new Set([...p, ...payload])])
    setStep(2)
  }
  console.log(links)
  function onSubmit() {
    mutate(
      {
        urls: includedLinks,
        folderName: projectId
      },
      {
        onSuccess() {
          setIncludedLinks([])
          setLinks([])
          setStep(1)
        }
      }
    )
  }

  if (step === 1) {
    return (
      <GetLinks updateLinks={updateLinks} />
    )
  }

  return (
    <div className="mini-scroll-bar flex-1 max-h-96 overflow-y-auto">
      {
        includedLinks[0] &&
        <h5 className="mb-1 text-sm">{new URL(includedLinks?.[0])?.origin}</h5>
      }
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
            <label
              htmlFor={l}
              className="text-sm"
            >
              {new URL(l).pathname}
            </label>
          </div>
        ))
      }

      <button
        disabled={isPending}
        onClick={onSubmit}
        className="df px-12 py-1.5 mt-4 mx-auto bg-input hover:bg-input/80"
      >
        Crawle Pages
      </button>
    </div>
  )
}

export default Add
