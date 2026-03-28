import axiosClient from "./axiosClient";

function normalizeBannerList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.banners)) return data.data.banners;
  if (Array.isArray(data?.banners)) return data.banners;
  return [];
}

export const getBannersApi = async (params = {}) => {
  try {
    const response = await axiosClient.get("/api/banners", { params });
    const raw = response?.data;
    return normalizeBannerList(raw);
  } catch (err) {
    console.error("[getBannersApi]", err?.response?.status, err?.message, err?.response?.data);
    return [];
  }
};

export const createBannerApi = async (payload) => {
  const response = await axiosClient.post("/api/banners", payload);
  return response?.data?.data?.banner || response?.data?.banner || null;
};

export const updateBannerApi = async (id, payload) => {
  const response = await axiosClient.put(`/api/banners/${id}`, payload);
  return response?.data?.data?.banner || response?.data?.banner || null;
};

export const deleteBannerApi = async (id) => {
  const response = await axiosClient.delete(`/api/banners/${id}`);
  return response?.data || null;
};
