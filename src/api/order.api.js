import axiosClient from "./axiosClient";

export const createOrderApi = (orderId, payload)  => {
  return axiosClient.put(`/api/${orderId}/place-order`, payload);
};

export const getMyOrdersApi = async () => {
  return [];
};

export const getOrderDetailApi = (orderId) => {
  return axiosClient.get(`/api/${orderId}`);
};
