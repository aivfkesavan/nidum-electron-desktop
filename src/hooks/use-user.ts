import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { addInvite, confirmDeleteAccount, forgetPass, getInvites, getSharedServers, login, logout, removeInvite, reqDeleteAccount, resetPass, updatePass } from "../actions/user";
import { resetApp } from "../actions/general";

import useOnlineStatus from "./use-online-status";
import useContextStore from "../store/context";
import useDeviceStore from "../store/device";
import useConvoStore from "../store/conversations";
import useLoginStore from "../store/login";
import useAuthStore from "../store/auth";

import { findLatest } from "../utils";
import { useToast } from "../hooks/use-toast";

export function useSharedServers() {
  return useQuery({
    queryKey: ["shared-servers"],
    queryFn: getSharedServers,
    refetchInterval: 3000,
  })
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: getInvites,
  })
}

export function useLoginMutate() {
  const updateLogin = useLoginStore(s => s.update)
  const updateAuth = useAuthStore(s => s.update)
  const initConvo = useConvoStore(s => s.init)
  const data = useLoginStore(s => s.data)
  const init = useContextStore(s => s.init)

  const isOnline = useOnlineStatus()
  const navigate = useNavigate()

  const { toast } = useToast()

  function onLoginSuccess(data: { _id: string, email: string, token: string, isOfflineLogin: boolean }) {
    updateAuth({
      ...data,
      isLoggedIn: true,
    })

    init()
    initConvo()
    const convo = useConvoStore.getState().data[data?._id]
    const latestProjectId = findLatest(Object.values(convo.projects))
    const chats = convo.chats[latestProjectId.id]
    const latestChatId = findLatest(chats)
    let to = `/p/${latestProjectId?.id}`
    if (chats?.length === 1 || chats?.[0]?.title === "New Chat") {
      to = to + `/c/${latestChatId?.id}`
    }
    navigate(to, { replace: true })
    toast({ title: "Successfully logged in." })
  }

  async function offlineLogin(payload: { email: string, password: string }) {
    const isAlreadyLoggedIn = data?.find(d => d.email === payload.email)
    if (isAlreadyLoggedIn) {
      if (isAlreadyLoggedIn.password === payload.password) {
        onLoginSuccess({
          _id: isAlreadyLoggedIn?._id,
          email: isAlreadyLoggedIn?.email,
          token: isAlreadyLoggedIn?.token,
          isOfflineLogin: true,
        })
      } else {
        toast({ title: "Password not found" })
      }
    } else {
      toast({
        title: "User not found",
        description: "Please check your network connection."
      })
    }
  }

  return useMutation({
    mutationFn: isOnline ? login : offlineLogin,
    // mutationFn: login,
    onSuccess(res, variables) {
      if (!isOnline) return;
      updateLogin({
        _id: res?._id,
        token: res?.token,
        email: variables?.email,
        password: variables.password,
      })
      onLoginSuccess({
        _id: res?._id,
        email: variables?.email,
        token: res?.token,
        isOfflineLogin: false,
      })
    },
    onError(err, variables) {
      let hasError = err?.message
      if (!isOnline || hasError === "Network Error") {
        offlineLogin(variables)
        toast({ title: "Unable to log in. Please check your network connection." })
      }
      else {
        toast({ title: hasError || "An error occurred. Please try again." })
      }
    }
  })
}

export function useOfflineLoginCorrection() {
  const updateAuth = useAuthStore(s => s.update)
  const isOnline = useOnlineStatus()

  const data = useLoginStore(s => s.data)

  const isOfflineLogin = useAuthStore(s => s.isOfflineLogin)
  const email = useAuthStore(s => s.email)

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess(res) {
      updateAuth({
        token: res?.token,
        isOfflineLogin: false,
      })
    },
    onError() {
    }
  })

  useEffect(() => {
    if (isOfflineLogin && isOnline && email && data) {
      const password = data?.find(d => d.email === email)?.password
      if (password) {
        mutate({ email, password })
      }
    }
  }, [isOfflineLogin, isOnline, email, data])
}

export function useGoogleAuthMutate() {
  const updateAuth = useAuthStore(s => s.update)
  const initConvo = useConvoStore(s => s.init)
  const init = useContextStore(s => s.init)

  const navigate = useNavigate()

  const { toast } = useToast()

  return useMutation({
    // @ts-ignore
    mutationFn: window?.electronAPI?.googleAuth,
    onSuccess(res: any) {
      if (res?.error) {
        toast({ title: res?.message || "An error occurred. Please try again." })

      } else {
        updateAuth({
          _id: res?._id,
          email: res?.email,
          token: res?.token,
          isLoggedIn: true,
          isGoogleAuth: true,
        })
        init()
        initConvo()
        const convo = useConvoStore.getState().data[res?._id]
        const latestProjectId = findLatest(Object.values(convo.projects))
        const chats = convo.chats[latestProjectId.id]
        const latestChatId = findLatest(chats)
        let to = `/p/${latestProjectId?.id}`
        if (chats?.length === 1 || chats?.[0]?.title === "New Chat") {
          to = to + `/c/${latestChatId?.id}`
        }

        navigate(to, { replace: true })
        toast({ title: "Successfully logged in." })
      }
    },
    onError(err) {
      let hasError = err?.message
      if (hasError?.endsWith("prematurely")) return
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}

export function useUpdatePassMutate() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: updatePass,
    onSuccess() {
      toast({ title: "Password updated successfully" })
    },
    onError(err) {
      let hasError = err?.message
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}

export function useFogetPassMutate() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: forgetPass,
    onSuccess() {
      navigate("/reset-pass")
      toast({ title: "Check your email to retrieve the OTP." })
    },
    onError(err) {
      let hasError = err?.message
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}

export function useResetPassMutate() {
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: resetPass,
    onSuccess() {
      navigate("/login")
      toast({ title: "Password updated successfully" })
    },
    onError(err) {
      let hasError = err?.message
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}

export function useAddInviteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: addInvite,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["invites"] })
      toast({ title: "User successfully invited." })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useRemoveInviteMutate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: removeInvite,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["invites"] })
      toast({ title: "User successfully removed from the invite list." })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useLogoutMutate() {
  const clearAuth = useAuthStore(s => s.clear)
  const { toast } = useToast()

  const isOnline = useOnlineStatus()

  return useMutation({
    mutationFn: logout,
    onSuccess() {
      clearAuth()
      toast({ title: "Successfully logged out." })
    },
    onError(err) {
      if (!isOnline || err?.message === "Network Error") {
        toast({ title: "Please check your network connection to log out." })
      } else {
        toast({ title: err?.message || "An error occurred. Please try again." })
      }
    }
  })
}

export function useResetApp(showToast: boolean = true) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const clearContext = useContextStore(s => s.clearByUser)
  const clearDevice = useDeviceStore(s => s.clear)
  const clearLogins = useLoginStore(s => s.clear)
  const clearConvo = useConvoStore(s => s.clearByUser)
  const clearAuth = useAuthStore(s => s.clear)

  return useMutation({
    mutationFn: resetApp,
    onSuccess() {
      clearDevice()
      clearLogins()
      clearContext()
      clearConvo()
      clearAuth()
      navigate("/login", { replace: true })
      if (showToast) {
        toast({ title: "App data has been reset successfully." })
      }
    },
    onError(err) {
      console.log(err)
      if (showToast) {
        toast({ title: err?.message || "An error occurred. Please try again." })
      }
    }
  })
}

export function useReqAccountDeleteMutate() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (v: any) => reqDeleteAccount(),
    onSuccess() {
      toast({ title: "Check your email to retrieve the OTP." })
    },
    onError(err) {
      let hasError = err?.message
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}

export function useAccountDeleteConfirmMutate() {
  const { mutate } = useResetApp(false)
  const { toast } = useToast()
  const deviceId = useDeviceStore(s => s.deviceId)

  return useMutation({
    mutationFn: confirmDeleteAccount,
    onSuccess() {
      mutate({ includeModels: true, deviceId }, {
        onSuccess() {
          toast({ title: "Account deleted successfully" })
        }
      })
    },
    onError(err) {
      let hasError = err?.message
      toast({ title: hasError || "An error occurred. Please try again." })
    }
  })
}
