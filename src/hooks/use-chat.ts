import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { chatLimit, createChat, deleteChat, getChatsByProjectId, updateChat } from "../actions/chat";
import { useToast } from "../hooks/use-toast";
import { Chat } from "../types/base";

export function useChatsByProjectId(project_id: string) {
  return useInfiniteQuery({
    queryKey: ["chats", project_id],
    queryFn: ({ pageParam }) => getChatsByProjectId({ project_id, pageParam }),
    enabled: !!project_id,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageNum) => {
      return lastPage?.length < chatLimit ? undefined : lastPageNum + 1
    },
    select: res => res?.pages?.flat(),
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
