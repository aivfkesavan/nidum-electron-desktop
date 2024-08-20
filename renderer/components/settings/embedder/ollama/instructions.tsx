import Copy from "@components/settings/copy";

function Instructions() {
  return (
    <>
      <div className="text-xs">
        <p className="mb-4 text-white/60">To get started,</p>
        <ul className="pl-5 list-decimal text-white/80">
          <li className="mb-4">Open <span className="font-medium text-white">TWO Terminals</span></li>
          <li className="mb-4 space-y-2">
            <div>In the first, start the ollama server</div>
            <Copy val="OLLAMA_ORIGINS='*' OLLAMA_HOST=localhost:11434 ollama serve" />
          </li>
          <li className="mb-4 space-y-2">
            <div>In the second, run the ollama CLI (using the mxbai-embed-large model)</div>
            <Copy val="ollama pull mxbai-embed-large" />
          </li>
        </ul>
      </div>
    </>
  )
}

export default Instructions
