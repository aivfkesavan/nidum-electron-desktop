import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteMessage, getMessagesByChatId, pushMessages } from "../actions/message";
import { Message } from "../types/base";

export function useMessagesChatId(chat_id: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", chat_id],
    queryFn: () => getMessagesByChatId(chat_id),
    enabled: !!chat_id,
  })
}

export function useMessagePushMutate() {
  return useMutation({
    mutationFn: pushMessages,
  })
}

export function useMessageDeleteMutate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ _id }: { _id: string, chat_id: string }) => deleteMessage(_id),
    onSuccess(res, variables) {
      queryClient.setQueryData(
        ["messages", variables?.chat_id],
        (old: any) => old?.filter((d: any) => d._id !== variables?._id)
      )
    },
  })
}
