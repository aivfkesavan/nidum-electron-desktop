import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createChat, deleteChat, getChat, updateChat } from "../actions/chat";
import { useToast } from "../components/ui/use-toast";

export function useChat(project_id: string) {
  return useQuery({
    queryKey: ["chats", project_id],
    queryFn: () => getChat(project_id),
    enabled: !!project_id,
  })
}

export function useChatMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => !data?._id ? createChat(data) : updateChat(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["chats", variables?.project_id] })
      toast({ title: `Chat ${variables?._id ? "updated" : "created"} successfully` })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useChatDeleteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteChat,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      toast({ title: "Chat deleted successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}
