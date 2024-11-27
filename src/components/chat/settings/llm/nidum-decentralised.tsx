import { useLLMModels } from "../../../../hooks/use-llm-models";

function NidumDecentralised() {
  const { data: nidumCentralised } = useLLMModels("nidum-decentralised")

  return (
    <>
      <div className="my-4">
        <label
          className="mb-0.5 text-xs opacity-70"
        >
          Model
        </label>

        <input
          className="text-sm px-2 py-1.5 bg-transparent border text-zinc-300"
          defaultValue={nidumCentralised?.model}
          disabled
        />
      </div>

      <div className="text-xs text-zinc-400/90">
        Nidum AI: Decentralized, diverse, unrestricted AI, powered by Nidum AI.
      </div>
    </>
  )
}

export default NidumDecentralised
