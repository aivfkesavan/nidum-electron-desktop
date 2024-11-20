import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Project } from "../types/base";

import { createProject, deleteProject, getProjectById, getProjectsByUserId, updateProject } from "../actions/project";
import { useToast } from "../components/ui/use-toast";

export function useProjectsByUserId() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjectsByUserId,
  })
}

export function useProjectById(_id: string) {
  return useQuery<Project>({
    queryKey: ["project", _id],
    queryFn: () => getProjectById(_id),
    enabled: !!_id,
  })
}

export function useProjectMutaate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => !data?._id ? createProject(data) : updateProject(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
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
