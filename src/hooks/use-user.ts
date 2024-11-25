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

import { useToast } from "../components/ui/use-toast";

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
  // const data = useLoginStore(s => s.data)

  const isOnline = useOnlineStatus()
  const navigate = useNavigate()

  const { toast } = useToast()

  function onLoginSuccess(data: { _id: string, email: string, token: string }) {
    updateAuth({
      ...data,
      isLoggedIn: true,
    })

    navigate("/", { replace: true })
    toast({ title: "User loggedin successfully" })
  }

  // async function offlineLogin(payload: { email: string, password: string }) {
  //   const isAlreadyLoggedIn = data?.find(d => d.email === payload.email)
  //   if (isAlreadyLoggedIn) {
  //     if (isAlreadyLoggedIn.password === payload.password) {
  //       onLoginSuccess({
  //         _id: isAlreadyLoggedIn?._id,
  //         email: isAlreadyLoggedIn?.email,
  //         token: isAlreadyLoggedIn?.token,
  //       })
  //     } else {
  //       toast({ title: "Password not found" })
  //     }
  //   } else {
  //     toast({
  //       title: "User not found",
  //       description: "Please check your network"
  //     })
  //   }
  // }

  return useMutation({
    // mutationFn: isOnline ? login : offlineLogin,
    mutationFn: login,
    onSuccess(res, variables) {
      // if (!isOnline) return;
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
      })
    },
    onError(err, variables) {
      let hasError = err?.message
      if (!isOnline || hasError === "Network Error") {
        // offlineLogin(variables)
        toast({ title: "Please check your network connection to log in" })
      }
      else if (hasError) {
        toast({ title: hasError })
      }
      else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  })
}

export function useGoogleSignupMutate() {
  const navigate = useNavigate()

  const { toast } = useToast()

  return useMutation({
    // @ts-ignore
    mutationFn: window?.electronAPI?.googleSignup,
    onSuccess(res: any) {
      if (res?.error) {
        toast({ title: res?.message || "Something went wrong!!!" })

      } else {
        navigate("/login", { replace: true })
        toast({ title: "User account created successfully" })
      }
    },
    onError(err) {
      let hasError = err?.message
      if (hasError) {
        toast({ title: hasError })

      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  })
}

export function useGoogleLoginMutate() {
  const updateAuth = useAuthStore(s => s.update)

  const navigate = useNavigate()

  const { toast } = useToast()

  return useMutation({
    // @ts-ignore
    mutationFn: window?.electronAPI?.googleLogin,
    onSuccess(res: any) {
      if (res?.error) {
        toast({ title: res?.message || "Something went wrong!!!" })

      } else {
        updateAuth({
          _id: res?._id,
          email: res?.email,
          token: res?.token,
          isLoggedIn: true,
          isGoogleAuth: true,
        })

        navigate("/", { replace: true })
        toast({ title: "User loggedin successfully" })
      }
    },
    onError(err) {
      let hasError = err?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
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
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
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
      toast({ title: "Please check your email for OTP" })
    },
    onError(err) {
      let hasError = err?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
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
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
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
      toast({ title: "User invited successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
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
      toast({ title: "User removed from invites successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

export function useLogoutMutate() {
  const clearContext = useContextStore(s => s.clear)
  const clearAuth = useAuthStore(s => s.clear)
  const { toast } = useToast()

  const isOnline = useOnlineStatus()

  return useMutation({
    mutationFn: logout,
    onSuccess() {
      clearAuth()
      clearContext()
      toast({ title: "User logged out successfully" })
    },
    onError(err) {
      if (!isOnline || err?.message === "Network Error") {
        toast({ title: "Please check your network connection to log out" })
      } else {
        toast({ title: err?.message || "Something went wrong!" })
      }
    }
  })
}

export function useResetApp(showToast: boolean = true) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const clearContext = useContextStore(s => s.clear)
  const clearDevice = useDeviceStore(s => s.clear)
  const clearLogins = useLoginStore(s => s.clear)
  const clearConvo = useConvoStore(s => s.clear)
  const clearAuth = useAuthStore(s => s.clear)

  return useMutation({
    mutationFn: resetApp,
    onSuccess() {
      clearDevice()
      clearLogins()
      clearAuth()
      clearContext()
      clearConvo()
      navigate("/login", { replace: true })
      if (showToast) {
        toast({ title: "App data reseted successfully" })
      }
    },
    onError(err) {
      console.log(err)
      if (showToast) {
        toast({ title: err?.message || "Something went wrong!" })
      }
    }
  })
}

export function useReqAccountDeleteMutate() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (v: any) => reqDeleteAccount(),
    onSuccess() {
      toast({ title: "Please check your email for OTP" })
    },
    onError(err) {
      let hasError = err?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  })
}

export function useAccountDeleteConfirmMutate() {
  const { mutate } = useResetApp(false)
  const { toast } = useToast()
  const appId = useDeviceStore(s => s.appId)

  return useMutation({
    mutationFn: confirmDeleteAccount,
    onSuccess() {
      mutate({ includeModels: true, appId }, {
        onSuccess() {
          toast({ title: "Account deleted successfully" })
        }
      })
    },
    onError(err) {
      let hasError = err?.message
      if (hasError) {
        toast({ title: hasError })
      } else {
        toast({
          title: "Something went wrong!!!",
          description: "Try again, later.",
        })
      }
    }
  })
}
