import axiosClient from "./axiosClient";

export const getProductsApi = async () => {
  const res = await axiosClient.get("/api/products");
  return res?.data?.products ?? [];
};

export const getProductVariantsApi = async (productId) => {
  const res = await axiosClient.get("/api/product-variants", {
    params: productId ? { product_id: productId } : undefined,
  });
  return res?.data?.variants ?? [];
};

/**
 * GET /api/product-images?product_id={id}
 * Response: { message, statusCode, data: { images: [{ image_id, product_id, url, is_main, ... }] } }
 */
export const getProductImagesApi = async (productId) => {
  const res = await axiosClient.get("/api/product-images", {
    params: productId ? { product_id: productId } : undefined,
  });
  const data = res?.data;
  const raw = data?.images ?? data?.data?.images;
  return Array.isArray(raw) ? raw : [];
};

export const getProductsFullApi = async (params = {}) => {
  const res = await axiosClient.get("/api/products/full", { params });
  const payload = res?.data?.data ?? res?.data;
  const products = Array.isArray(payload)
    ? payload
    : payload?.products ?? [];

  const pagination = res?.data?.pagination ?? payload?.pagination ?? null;

  return {
    products,
    pagination,
  };
};

export const getAllProducts = async (params = { page: 1, limit: 10 }) => {
  const result = await getProductsFullApi(params);
  return result.products;
};

export const getProducts = async () => {
  const [products, variants, images] = await Promise.all([
    getProductsApi(),
    getProductVariantsApi(),
    getProductImagesApi(),
  ]);

  return {
    products,
    variants,
    images,
  };
};

