import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useContextStore from '@store/context';
import useModelStore from '@store/model';
import { useToast } from '@components/ui/use-toast';

function useStreamingFetch() {
  const updateContext = useModelStore(s => s.updateContext)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)
  const name = useModelStore(s => s.name)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [data, setData] = useState(0)

  useEffect(() => {
    if (!ollamaUrl || !name) return

    const controller = new AbortController()
    const { signal } = controller

    const fetchData = async () => {
      try {
        const response = await fetch(`${ollamaUrl}/api/pull`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
          signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            setData(100)
            break
          }

          const chunk = decoder.decode(value)
          if (chunk) {
            const parsed = JSON?.parse(chunk)
            if (parsed && parsed.status?.startsWith("pulling")) {
              const perc = Math.round((Number(parsed.completed) / Number(parsed.total)) * 100)
              setData(isNaN(perc) ? 0 : perc)
            }
            if (parsed && parsed.status === "success") {
              queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
              toast({ title: "Dowload completed" })
              updateContext({ is_downloading: false, name: "" })
              break
            }
          }
        }

      } catch (err) {
        setData(0)
        updateContext({ is_downloading: false, name: "" })
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [ollamaUrl, name])

  return data
}

export default useStreamingFetch