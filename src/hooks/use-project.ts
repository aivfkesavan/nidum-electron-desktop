import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Project } from "../types/base";

import { createProject, deleteProject, getProjectById, getProjectsMiniByUserId, projectLimit, updateProject } from "../actions/project";
import { useToast } from "../components/ui/use-toast";

export function useProjectsMiniByUserId() {
  return useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam }) => getProjectsMiniByUserId(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageNum) => {
      return lastPage?.length < projectLimit ? undefined : lastPageNum + 1
    },
    select: res => res?.pages?.flat(),
  })
}

export function useProjectById(_id: string) {
  return useQuery<Project>({
    queryKey: ["project", _id],
    queryFn: () => getProjectById(_id),
    enabled: !!_id,
  })
}

export function useProjectMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Partial<Project>) => !data?._id ? createProject(data) : updateProject(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      if (variables?._id) {
        queryClient.invalidateQueries({ queryKey: ["project", variables?._id] })
      }
      toast({ title: `Project ${variables?._id ? "updated" : "created"} successfully` })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useProjectDeleteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({ title: "Project deleted successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}
