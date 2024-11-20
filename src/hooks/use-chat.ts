import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createChat, deleteChat, getChatsByProjectId, updateChat } from "../actions/chat";
import { useToast } from "../components/ui/use-toast";
import { Chat } from "../types/base";

export function useChatsByProjectId(project_id: string) {
  return useQuery<Chat[]>({
    queryKey: ["chats", project_id],
    queryFn: () => getChatsByProjectId(project_id),
    enabled: !!project_id,
  })
}

export function useChatMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Partial<Chat> & { project_id: string }) => !data?._id ? createChat(data) : updateChat(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["chats", variables?.project_id] })
      if (!variables?._id) {
        toast({ title: "New chat created successfully" })
      }
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
    mutationFn: ({ _id }: { _id: string, project_id: string }) => deleteChat(_id),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["chats", variables?.project_id] })
      toast({ title: "Chat deleted successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}
