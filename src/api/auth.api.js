import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data ?? res ?? null;

export const loginApi = async (payload) => {
  const res = await axiosClient.post("/api/login", payload);
  return unwrap(res);
};

export const registerApi = async (payload) => {
  const res = await axiosClient.post("/api/register", payload);
  return unwrap(res);
};

export const forgotPasswordApi = async (email) => {
  const res = await axiosClient.post("/api/forgot-password", { email });
  return unwrap(res);
};

export const verifyOtpApi = async (email, otp) => {
  const res = await axiosClient.post("/api/verify-otp", { email, otp });
  return unwrap(res);
};

export const resendOtpApi = async (email) => {
  const res = await axiosClient.post("/api/resend-otp", { email });
  return unwrap(res);
};

export const getMeApi = async () => {
  const res = await axiosClient.get("/api/me");
  return unwrap(res);
};

export const logoutApi = async () => {
  const res = await axiosClient.post("/api/logout");
  return unwrap(res);
};

export const updateMeApi = async (userId, payload) => {
  if (!userId) throw new Error("Missing userId for updateMeApi");
  const res = await axiosClient.put(`/api/users/${userId}`, payload);
  return unwrap(res);
};

export const changePasswordApi = async (userId, payload) => {
  if (!userId) throw new Error("Missing userId for changePasswordApi");
  const res = await axiosClient.put(`/api/users/${userId}`, payload);
  return unwrap(res);
};
