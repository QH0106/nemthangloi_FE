import axiosClient from "./axiosClient";

export const getVariantsByProductApi = (
  productId
)  => {
  return axiosClient.get("/api/product-variants", {
    params: { product_id: productId },
  });
};
