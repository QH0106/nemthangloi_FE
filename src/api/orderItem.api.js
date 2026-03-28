import axiosClient from "./axiosClient";


export const getOrderItemsApi = (orderId) => {
  return axiosClient.get(`/orders/${orderId}/items`);
};
