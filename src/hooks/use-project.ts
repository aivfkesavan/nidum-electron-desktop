import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProject, deleteProject, getProject, updateProject } from "../actions/project";
import { useToast } from "../components/ui/use-toast";

export function useProject() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProject,
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
