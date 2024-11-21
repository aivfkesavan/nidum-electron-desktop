import { useEffect } from "react";

import useContextStore from "../store/context";
import useConvoStore from "../store/conversations";
import useAuthStore from "../store/auth";

export function useCheckInit() {
  const clearContext = useContextStore(s => s.clear)
  const clearConvo = useConvoStore(s => s.clear)
  const clearAuth = useAuthStore(s => s.clear)
  const initialsed = useAuthStore(s => s.initialsed)

  useEffect(() => {
    if (!initialsed) {
      clearAuth()
      clearConvo()
      clearContext()
    }
  }, [initialsed])
}
