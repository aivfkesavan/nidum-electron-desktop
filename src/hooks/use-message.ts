import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createMessage, deleteMessage, getMessage, updateMessage } from "../actions/message";
import { useToast } from "../components/ui/use-toast";

export function useMessage(chat_id: string) {
  return useQuery({
    queryKey: ["messages", chat_id],
    queryFn: () => getMessage(chat_id),
    enabled: !!chat_id,
  })
}

export function useMessageMutaate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => !data?._id ? createMessage(data) : updateMessage(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["message", variables?.chat_id] })
      toast({ title: `Message ${variables?._id ? "updated" : "created"} successfully` })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useMessageDeleteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["config"] })
      toast({ title: "Message deleted successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}