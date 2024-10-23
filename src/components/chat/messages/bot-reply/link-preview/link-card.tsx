
function LinkCard(metadata: any) {
  const len = Object.values(metadata).filter(Boolean).length
  const hasData = metadata?.isBig ? len > 3 : len > 2

  if (!hasData) {
    return (
      <a className="block" href={metadata?.url} target="_blank">
        <div className="dfc gap-1 px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800">
          <div className="flex-1 leading-4 line-clamp-2 opacity-55">Cannot preview informations</div>

          <div className="df gap-1">
            <span className="size-4 bg-gray-700 rounded-full"></span>
            <span className="flex-1 truncate">{metadata?.url}</span>
          </div>
        </div>
      </a>
    )
  }

  return (
    <a className="block" href={metadata?.url} target="_blank">
      <div className="dfc gap-1 px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800">
        <div className="flex-1 text-balance leading-4 line-clamp-2 opacity-90">{metadata?.title}</div>
        {
          metadata?.isBig &&
          <div className="my-1 line-clamp-3 opacity-70">{metadata?.description}</div>
        }
        <div className="df gap-1">
          <img
            className="size-4 rounded-full"
            src={metadata?.favicon}
          />
          <p className="flex-1 truncate">{metadata?.siteName}</p>
        </div>
      </div>
    </a>
  )
}

export default LinkCard
