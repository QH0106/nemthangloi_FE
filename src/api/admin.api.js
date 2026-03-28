import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data ?? null;

export const adminLoginApi = async (payload) => {
  const res = await axiosClient.post("/api/login", payload);
  return unwrap(res);
};

export const listCategoriesAdminApi = async (params = { page: 1, limit: 10 }) => {
  const res = await axiosClient.get("/api/categories", { params });
  const data = unwrap(res) ?? {};
  const payload = data?.data ?? data;
  return {
    categories: payload?.categories ?? [],
    pagination: payload?.pagination ?? null,
  };
};

export const createCategoryAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/categories", payload);
  return unwrap(res)?.category ?? null;
};

export const updateCategoryAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/categories/${id}`, payload);
  return unwrap(res)?.category ?? null;
};

export const deleteCategoryAdminApi = (id) =>
  axiosClient.delete(`/api/categories/${id}`);

export const listProductsAdminApi = async (params = { page: 1, limit: 20 }) => {
  const res = await axiosClient.get("/api/products/full", { params });
  const data = unwrap(res) ?? {};
  console.log("listProductsAdminApi response:", data);
  return {
    products: data.data ?? [],
    pagination: data?.pagination ?? null,
  };
};

export const createProductAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/products", payload);
  return unwrap(res)?.product ?? null;
};

export const createProductBundleAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/products/bundle", payload);
  return unwrap(res) ?? null;
};

export const updateProductAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/products/${id}`, payload);
  return unwrap(res)?.product ?? null;
};

export const deleteProductAdminApi = (id) =>
  axiosClient.delete(`/api/products/${id}`);

export const listVariantsAdminApi = async (params = {}) => {
  const res = await axiosClient.get("/api/product-variants", { params });
  const data = unwrap(res) ?? {};
  const payload = data?.data ?? data;
  return {
    variants: payload?.variants ?? [],
    pagination: payload?.pagination ?? null,
  };
};

export const createVariantAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/product-variants", payload);
  return unwrap(res)?.variant ?? null;
};

export const updateVariantAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/product-variants/${id}`, payload);
  return unwrap(res)?.variant ?? null;
};

export const deleteVariantAdminApi = (id) =>
  axiosClient.delete(`/api/product-variants/${id}`);

export const listImagesAdminApi = async (params = {}) => {
  const res = await axiosClient.get("/api/product-images", { params });
  const data = unwrap(res) ?? {};
  const payload = data?.data ?? data;
  return {
    images: payload?.images ?? [],
    pagination: payload?.pagination ?? null,
  };
};

export const createImageAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/product-images", payload);
  const data = unwrap(res) ?? {};
  return data?.image ?? data?.data?.image ?? null;
};

export const uploadImagesAdminApi = async (formData) => {
  const res = await axiosClient.post("/api/uploads/images", formData);
  const data = unwrap(res) ?? {};
  return data?.files ?? data?.data?.files ?? [];
};

export const updateImageAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/product-images/${id}`, payload);
  return unwrap(res)?.image ?? null;
};

export const deleteImageAdminApi = (id) =>
  axiosClient.delete(`/api/product-images/${id}`);

export const listPromotionsAdminApi = async (params = {}) => {
  const res = await axiosClient.get("/api/variant-promotions", { params });
  const data = unwrap(res) ?? {};
  const payload = data?.data ?? data;
  return {
    promotions: payload?.promotions ?? [],
    pagination: payload?.pagination ?? null,
  };
};

export const createPromotionAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/variant-promotions", payload);
  return unwrap(res)?.promotion ?? null;
};

export const updatePromotionAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/variant-promotions/${id}`, payload);
  return unwrap(res)?.promotion ?? null;
};

export const deletePromotionAdminApi = (id) =>
  axiosClient.delete(`/api/variant-promotions/${id}`);

export const listBannersAdminApi = async (params = {}) => {
  const res = await axiosClient.get("/api/banners", { params });
  const data = unwrap(res) ?? {};
  const payload = data?.data ?? data;
  return {
    banners: payload?.banners ?? [],
  };
};

export const createBannerAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/banners", payload);
  const data = unwrap(res) ?? {};
  return data?.banner ?? data?.data?.banner ?? null;
};

export const updateBannerAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/banners/${id}`, payload);
  const data = unwrap(res) ?? {};
  return data?.banner ?? data?.data?.banner ?? null;
};

export const deleteBannerAdminApi = (id) =>
  axiosClient.delete(`/api/banners/${id}`);

export const getOrderByIdAdminApi = async (orderId) => {
  const res = await axiosClient.get(`/api/orders/${orderId}`);
  console.log("getOrderByIdAdminApi raw response:", res);
  return unwrap(res)?.cart ?? null;
};

export const getOrderByCodeAdminApi = async (orderCode) => {
  const res = await axiosClient.get(`/api/orders/code/${orderCode}`);
  return unwrap(res)?.cart ?? null;
};

export const updateOrderAdminApi = async (orderId, payload) => {
  const res = await axiosClient.put(`/api/orders/${orderId}`, payload);
  return unwrap(res)?.order ?? null;
};

export const placeOrderAdminApi = async (orderId, payload) => {
  const res = await axiosClient.put(`/api/orders/${orderId}/place-order`, payload);
  return unwrap(res)?.order ?? null;
};

export const listUsersAdminApi = async (params = { page: 1, limit: 10, search: "" }) => {
  const res = await axiosClient.get("/api/users", { params });
  const data = unwrap(res) ?? {};
  return {
    users: data?.users ?? [],
    pagination: data?.pagination ?? null,
  };
};

export const getUserAdminApi = async (id) => {
  const res = await axiosClient.get(`/api/users/${id}`);
  return unwrap(res)?.user ?? null;
};

export const createUserAdminApi = async (payload) => {
  const res = await axiosClient.post("/api/users", payload);
  return unwrap(res)?.user ?? null;
};

export const updateUserAdminApi = async (id, payload) => {
  const res = await axiosClient.put(`/api/users/${id}`, payload);
  return unwrap(res)?.user ?? null;
};

export const deleteUserAdminApi = (id) =>
  axiosClient.delete(`/api/users/${id}`);
