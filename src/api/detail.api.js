import axiosClient from "@/api/axiosClient";

const PLACEHOLDER_IMAGE = "/image-placeholder.png";

function getProductFromResponse(res) {
  const data = res?.data;
  return data?.product ?? data?.data?.product ?? null;
}

function normalizeProductFull(product) {
  if (!product) return null;
  const ProductImages = product.ProductImages ?? [];
  const ProductVariants = product.ProductVariants ?? [];
  const imagesSorted = [...ProductImages].sort(
    (a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)
  );
  const imagesNormalized =
    imagesSorted.length > 0
      ? imagesSorted.map((img) => ({
          image_id: img.image_id,
          product_id: img.product_id,
          url: img.url ?? PLACEHOLDER_IMAGE,
          is_main: !!img.is_main,
        }))
      : [{ url: PLACEHOLDER_IMAGE, is_main: true }];
  return {
    ...product,
    ProductImages: imagesNormalized,
    ProductVariants: Array.isArray(ProductVariants) ? ProductVariants : [],
  };
}

/**
 * GET /api/products/:id – full product with ProductImages, ProductVariants (VariantPromotions), Categories.
 * No need to call product-images or product-variants separately.
 */
export const getDetailProduct = async (id) => {
  if (!id) return null;
  try {
    const res = await axiosClient.get(`/api/products/${id}`);
    const product = getProductFromResponse(res);
    if (!product) return null;
    return normalizeProductFull(product);
  } catch (err) {
    console.error("[getDetailProduct]", err?.response?.status, err?.message);
    return null;
  }
};
