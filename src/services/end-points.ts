
export const root = {
  liveBackendBaseUrl: "https://apiv1.chain.nidum.ai/api" // http://localhost:5000/api
}

export const endPoints = {
  // auth
  register: "/user/register",
  resendOtp: "/user/resend-otp",
  verifyOtp: "/user/verify-otp",
  updatePass: "/user/update-pass",
  forgetPass: "/user/forget-pass",
  resetPass: "/user/reset-pass",
  login: "/user/login",
  logout: "/user/logout",
  deleteOtp: "/user/delete-otp",
  deleteAccount: "/user/account", // :otp

  // user
  invites: "/user/invites",
  sharedServer: "/user/shared-server",
  addInvite: "/user/invites/add",
  removeInvites: "/user/invites/remove",

  // device
  initDevice: "/device/init", // :deviceId
  sharedDevice: "/device/shared", // :deviceId
  device: "/device",

  config: "/config",
  project: "/project",
  chat: "/chat",

  message: "/message",
  messagePush: "/message/push",

} as const
