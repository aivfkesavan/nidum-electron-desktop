import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getInitDevice, getSharedDevice, goPublic, nidumChainEnable, nidumChainReserve, nidumChainUrlConfig, stopPublicShare, updateDevice } from "../actions/device";
import useDeviceStore from "../store/device";

import { useToast } from "../hooks/use-toast";

export function useInitDevice() {
  const deviceId = useDeviceStore(s => s.deviceId)

  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => getInitDevice(deviceId),
    enabled: !!deviceId,
  })
}

export function useSharedDevice(deviceId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => getSharedDevice(deviceId),
    enabled: !!deviceId && enabled,
  })
}

export function useDeviceMutate() {
  const queryClient = useQueryClient()
  const deviceId = useDeviceStore(s => s.deviceId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: updateDevice,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["device", deviceId] })
      toast({ title: "Device details updated successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useNidumChainSetup() {
  const isNidumUrlConfigured = useDeviceStore(s => s.isNidumUrlConfigured)
  const isNidumReserved = useDeviceStore(s => s.isNidumReserved)
  const isNidumEnabled = useDeviceStore(s => s.isNidumEnabled)
  const deviceId = useDeviceStore(s => s.deviceId)
  const update = useDeviceStore(s => s.update)

  const { data: step1 } = useQuery({
    queryKey: ["nidum-chain-url-config"],
    queryFn: nidumChainUrlConfig,
    enabled: !isNidumUrlConfigured,
  })

  const { data: step2 } = useQuery({
    queryKey: ["nidum-chain-enable"],
    queryFn: nidumChainEnable,
    enabled: isNidumUrlConfigured && !isNidumEnabled,
  })

  const { data: step3 } = useQuery({
    queryKey: ["nidum-chain-reserve"],
    queryFn: () => nidumChainReserve(deviceId),
    enabled: isNidumEnabled && !isNidumReserved,
  })

  useEffect(() => {
    if (step1 || step2 || step3) {
      update({
        isNidumUrlConfigured: !!step1?.msg,
        isNidumEnabled: !!step2?.msg,
        isNidumReserved: !!step3?.msg,
      })
    }
  }, [step1, step2, step3])
}

export function useGoPublicMutate() {
  const update = useDeviceStore(s => s.update)
  const deviceId = useDeviceStore(s => s.deviceId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: () => goPublic(deviceId),
    onSuccess() {
      toast({ title: "Public share enabled" })
      update({ isNidumSharedPublic: true })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useStopShareMutate() {
  const update = useDeviceStore(s => s.update)

  const { toast } = useToast()

  return useMutation({
    mutationFn: stopPublicShare,
    onSuccess() {
      toast({ title: "Stoped public share" })
      update({ isNidumSharedPublic: false })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useStopShareOnAppLeave() {
  const update = useDeviceStore(s => s.update)
  const isNidumSharedPublic = useDeviceStore(s => s.isNidumSharedPublic)

  useEffect(() => {
    return () => {
      if (isNidumSharedPublic) {
        stopPublicShare()
        update({ isNidumSharedPublic: false })
      }
    }
  }, [isNidumSharedPublic])
}
