import axiosClient from "./axiosClient";

export const getImagesByProductApi = (
  productId
) => {
  return axiosClient.get("/api/product-images", {
    params: { product_id: productId },
  });
};
