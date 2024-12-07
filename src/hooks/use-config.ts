import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createConfig, deleteConfig, getConfig, updateConfig } from "../actions/config";
import { useToast } from "../hooks/use-toast";

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
  })
}

export function useConfigMutaate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => !data?._id ? createConfig(data) : updateConfig(data),
    onSuccess(res, variables) {
      queryClient.invalidateQueries({ queryKey: ["config"] })
      toast({ title: `Configurations ${variables?._id ? "updated" : "created"} successfully` })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useConfigDeleteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteConfig,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["config"] })
      toast({ title: "Configurations deleted successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}
