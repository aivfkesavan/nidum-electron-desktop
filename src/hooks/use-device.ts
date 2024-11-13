import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getDeviceInfo, updateDevice } from "../actions/device";
import useDeviceStore from "../store/device";

import { useToast } from "../components/ui/use-toast";

export function useDeviceInfo() {
  const appId = useDeviceStore(s => s.appId)

  return useQuery({
    queryKey: ["device", appId],
    queryFn: () => getDeviceInfo(appId),
    enabled: !!appId,
  })
}

export function useDeviceMutate() {
  const queryClient = useQueryClient()
  const appId = useDeviceStore(s => s.appId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: updateDevice,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["device", appId] })
      toast({ title: "Device details updated successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}
