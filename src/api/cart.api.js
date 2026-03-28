import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data ?? res ?? null;

export const addToCartApi = async (payload, config = {}) => {
  const res = await axiosClient.post("/api/orders/add-to-cart", payload, config);
  const body = unwrap(res);
  return body?.cart ?? body?.data?.cart ?? null;
};

export const getCart = async (orderId, config = {}) => {
  const res = await axiosClient.get(`/api/orders/${orderId}`, config);
  const body = unwrap(res);
  return body?.cart ?? body?.data?.cart ?? null;
};

export const getMyPendingCartApi = async (config = {}) => {
  const res = await axiosClient.get('/api/orders/pending/me', config);
  const body = unwrap(res);
  return body?.cart ?? body?.data?.cart ?? null;
};

export const updateOrderApi = async (orderId, payload, config = {}) => {
  const res = await axiosClient.put(`/api/orders/${orderId}`, payload, config);
  const body = unwrap(res);
  return body?.order ?? body?.data?.order ?? null;
};

export const placeOrderApi = async (orderId, payload) => {
  const res = await axiosClient.put(`/api/orders/${orderId}/place-order`, payload);
  const body = unwrap(res);
  return body?.order ?? body?.data?.order ?? null;
};

export const submitOrderUserApi = async (orderId, payload, config = {}) => {
  const res = await axiosClient.put(`/api/orders/${orderId}/submit-order-user`, payload, config);
  const body = unwrap(res);
  return body?.order ?? body?.data?.order ?? null;
};

export const submitOrderGuestApi = async (payload, config = {}) => {
  const res = await axiosClient.post(`/api/orders/submit-order-guest`, payload, config);
  const body = unwrap(res);
  return body?.order ?? body?.data?.order ?? null;
};

export const removeCartItemApi = async (orderItemId, config = {}) => {
  const res = await axiosClient.delete(`/api/orders/item/${orderItemId}`, config);
  return res;
};

export const clearCartApi = async (orderId, config = {}) => {
  const res = await axiosClient.delete(`/api/orders/${orderId}/clear`, config);
  return res;
};
