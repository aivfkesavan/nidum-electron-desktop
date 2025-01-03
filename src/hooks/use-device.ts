import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getInitDevice, getSharedDevice, goPublic, isLiveCheck, nidumChainSetupFlow, nidumChainSetupStaus, stopPublicShare, updateDevice } from "../actions/device";
import useDeviceStore from "../store/device";

import { useToast } from "../hooks/use-toast";

export function useInitDevice() {
  const deviceId = useDeviceStore(s => s.deviceId)

  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => getInitDevice(deviceId),
    enabled: !!deviceId,
    gcTime: Infinity,
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
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useNidumChainSetup() {
  const deviceId = useDeviceStore(s => s.deviceId)

  const { isLoading, data } = useQuery({
    queryKey: ["nidum-chain-setup-status"],
    queryFn: nidumChainSetupStaus,
    enabled: !!deviceId,
  })

  const { mutate } = useMutation({
    mutationFn: (disable: boolean) => nidumChainSetupFlow(deviceId, disable),
  })

  useEffect(() => {
    if (data) {
      const isSuccess = data?.["nidum-chain-url-config"] && data?.["nidum-chain-enable"] && data?.["nidum-chain-reserve"]
      if (!isSuccess) {
        mutate(Object.keys(data).length === 0)
      }
    }
  }, [data])

  return {
    isLoading,
    data,
  }
}

export function useNidumChainSetupStatus() {
  return useQuery({
    queryKey: ["nidum-chain-setup-status"],
    queryFn: nidumChainSetupStaus,
  })
}

export function useNidumChainSetupRetry() {
  const queryClient = useQueryClient()
  const deviceId = useDeviceStore(s => s.deviceId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: () => nidumChainSetupFlow(deviceId, true),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["nidum-chain-setup-status"] })
    },
    onError(err) {
      toast({ title: "Setup failed. Please try again." })
    }
  })
}

export function useGoPublicMutate() {
  const update = useDeviceStore(s => s.update)
  const deviceId = useDeviceStore(s => s.deviceId)

  const { toast } = useToast()

  return useMutation({
    mutationFn: () => goPublic(deviceId),
    onSuccess() {
      toast({ title: "Public sharing has been enabled." })
      update({ isNidumSharedPublic: true })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useStopShareMutate() {
  const update = useDeviceStore(s => s.update)

  const { toast } = useToast()

  return useMutation({
    mutationFn: stopPublicShare,
    onSuccess() {
      toast({ title: "Public sharing has been disabled." })
      update({ isNidumSharedPublic: false })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function usePublicShareCheck() {
  const isNidumSharedPublic = useDeviceStore(s => s.isNidumSharedPublic)
  const deviceId = useDeviceStore(s => s.deviceId)
  const update = useDeviceStore(s => s.update)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["live-check", deviceId],
    queryFn: () => isLiveCheck(deviceId),
    enabled: isNidumSharedPublic,
    refetchInterval: isNidumSharedPublic ? 3000 : false,
  })

  useEffect(() => {
    if (!isLoading && !isFetching && !data && isNidumSharedPublic) {
      update({ isNidumSharedPublic: false })
      stopPublicShare()
    }
  }, [isLoading, isFetching, data, isNidumSharedPublic])
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
