import { endPoints } from "../services/end-points";
import sendApiReq from "../services/send-api-req";

type loginT = { email: string, password: string }
export function login(data: loginT) {
  return sendApiReq({
    isAuthendicated: false,
    method: "post",
    url: endPoints.login,
    data,
  })
}

export type verifyOtpT = { email: string, otp: number }
export function verifyOtp(data: verifyOtpT) {
  return sendApiReq({
    isAuthendicated: false,
    method: "post",
    url: endPoints.verifyOtp,
    data,
  })
}

export function resendOtp(email: string) {
  return sendApiReq({
    isAuthendicated: false,
    method: "post",
    url: endPoints.resendOtp,
    data: { email },
  })
}

export function signup(data: any) {
  return sendApiReq({
    isAuthendicated: false,
    method: "post",
    url: endPoints.register,
    data,
  })
}

export function logout() {
  return sendApiReq({
    method: "post",
    url: endPoints.logout,
    data: {}
  })
}

export function getSharedServers() {
  return sendApiReq({
    url: endPoints.sharedServer,
  })
}

export function getInvites() {
  return sendApiReq({
    url: endPoints.invites,
  })
}

export function addInvite(to: string) {
  return sendApiReq({
    method: "put",
    url: endPoints.addInvite,
    data: { to },
  })
}

export function removeInvite(to: string) {
  return sendApiReq({
    method: "put",
    url: endPoints.removeInvites,
    data: { to },
  })
}
