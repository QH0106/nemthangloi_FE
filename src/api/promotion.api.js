import axiosClient from "./axiosClient";

export const getPromotionsByVariantApi = (
  variantId
) => {
  return axiosClient.get("/api/variant-promotions", {
    params: { variant_id: variantId },
  });
};
