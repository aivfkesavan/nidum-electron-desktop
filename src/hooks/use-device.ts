import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { enableZrok, getDeviceInfo, getDomainBase, goPublic, stopPublicShare, updateDevice } from "../actions/device";
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

export function useDomainBase() {
  return useQuery({
    queryKey: ["domain-base"],
    queryFn: getDomainBase,
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

export function useZorkEnable() {
  const isZrokSetuped = useDeviceStore(s => s.isZrokSetuped)
  const appId = useDeviceStore(s => s.appId)
  const update = useDeviceStore(s => s.update)

  const { data } = useQuery({
    queryKey: ["zrok-setup"],
    queryFn: () => enableZrok(appId),
    enabled: !isZrokSetuped,
    retry: false,
  })

  useEffect(() => {
    if (data) {
      update({ isZrokSetuped: true })
    }
  }, [data])
}

export function useGoPublicMutate() {
  const update = useDeviceStore(s => s.update)
  const appId = useDeviceStore(s => s.appId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: () => goPublic(appId),
    onSuccess() {
      toast({ title: "Public share enabled" })
      update({ isPublicShared: true })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useStopShareMutate() {
  const update = useDeviceStore(s => s.update)
  const appId = useDeviceStore(s => s.appId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: () => stopPublicShare(appId),
    onSuccess() {
      toast({ title: "Stoped public share" })
      update({ isPublicShared: false })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}
