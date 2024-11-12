
export const root = {
  liveBackendBaseUrl: "http://localhost:5000/api",
}

export const endPoints = {
  // auth
  register: "/user/register",
  resendOtp: "/user/resend-otp",
  verifyOtp: "/user/verify-otp",
  login: "/user/login",
  logout: "/user/logout",

  // user
  invites: "/user/invites", // ?email
  sharedServer: "/user/shared-server", // ?email
  addInvite: "/user/invites/add",
  removeInvites: "/user/invites/remove",
  deleteOtp: "/user/delete-otp",
  deleteAccount: "/user/account", // :otp

} as const
