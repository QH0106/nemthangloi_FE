import axiosClient from "./axiosClient";

export const getProfileApi = () => {
  return axiosClient.get("/api/me");
};

export const updateProfileApi = (id, payload) => {
  if (!id) throw new Error("Missing user id for updateProfileApi");
  return axiosClient.put(`/api/users/${id}`, payload);
};
