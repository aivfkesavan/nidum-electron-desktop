import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { addInvite, getInvites, getSharedServers, login, logout, removeInvite } from "../actions/user";
import { useToast } from "../components/ui/use-toast";
import useAuthStore from "../store/auth";

export function useSharedServers() {
  return useQuery({
    queryKey: ["shared-servers"],
    queryFn: getSharedServers,
  })
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: getInvites,
  })
}

export function useLoginMutate() {
  const updateAuth = useAuthStore(s => s.update)
  const navigate = useNavigate()

  const { toast } = useToast()

  return useMutation({
    mutationFn: login,
    onSuccess(res, variables) {
      updateAuth({
        ip: res?.ip,
        _id: res?._id,
        email: variables?.email,
        token: res?.token,
        isLoggedIn: true,
      })
      navigate("/", { replace: true })
      toast({ title: "User invited successfully" })
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
  const clearAuth = useAuthStore(s => s.clear)
  const { toast } = useToast()

  return useMutation({
    mutationFn: logout,
    onSuccess() {
      clearAuth()
      toast({ title: "User logged out successfully" })
    },
    onError(err) {
      console.log(err)
      toast({ title: err?.message || "Something went wrong!" })
    }
  })
}

