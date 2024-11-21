import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import sendApiReq from "../services/send-api-req";

import useContextStore from "../store/context";
import useAuthStore from "../store/auth";

export function useCheckInit() {
  const updateContext = useContextStore(s => s.updateContext)
  const updateAuth = useAuthStore(s => s.update)
  const initialsed = useAuthStore(s => s.initialsed)
  const _id = useAuthStore(s => s._id)

  const { data } = useQuery({
    queryKey: ["init", _id],
    queryFn: () => sendApiReq({ url: "/user/init" }),
    enabled: !!_id && !initialsed,
    gcTime: Infinity,
  })

  useEffect(() => {
    if (data?._chat_id) {
      updateContext({
        chat_id: data?.chat_id,
        project_id: data?.project_id,
      })
    }
    if (data) {
      updateAuth({ initialsed: true })
    }
  }, [data])

  return initialsed
}
