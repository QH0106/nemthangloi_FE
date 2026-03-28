import { Grid, Container, Typography } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductGallery from "./Gallery/ProductGallery";
import ProductInfo from "./Info/ProductInfo";
import ProductTabs from "./Tabs/ProductTabs";
import { getDetailProduct } from "@/api/detail.api";

const PLACEHOLDER_IMAGE = "/image-placeholder.png";

const getFinalVariantPrice = (variant) => {
  if (!variant) return 0;
  const promotion = variant?.VariantPromotions?.[0];
  const originalPrice = Number(variant?.price_original ?? variant?.price ?? 0);

  if (promotion?.promotion_type === "discount_percent") {
    const discountPercent = Number(promotion.discount_percent ?? 0);
    return Math.round(originalPrice * (1 - discountPercent / 100));
  }

  return Number(variant?.price ?? 0);
};

const pickPreferredVariant = ({ variants, preferredVariantId, minPrice, maxPrice }) => {
  if (!Array.isArray(variants) || !variants.length) return null;

  if (preferredVariantId) {
    const matchedById = variants.find(
      (variant) => String(variant?.variant_id) === String(preferredVariantId),
    );
    if (matchedById) return matchedById;
  }

  const hasMin = Number.isFinite(minPrice);
  const hasMax = Number.isFinite(maxPrice);
  if (hasMin || hasMax) {
    const matchedByPrice = variants.find((variant) => {
      const finalPrice = getFinalVariantPrice(variant);
      const meetsMin = !hasMin || finalPrice >= minPrice;
      const meetsMax = !hasMax || finalPrice <= maxPrice;
      return meetsMin && meetsMax;
    });

    if (matchedByPrice) return matchedByPrice;
  }

  return variants[0];
};

export default function ProductDetail() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const preferredVariantId = searchParams.get("variantId");
  const minPrice = Number(searchParams.get("minPrice"));
  const maxPrice = Number(searchParams.get("maxPrice"));

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getDetailProduct(productId);
        if (!data) {
          setProductDetail(null);
          setLoading(false);
          return;
        }

        const variant = pickPreferredVariant({
          variants: data.ProductVariants,
          preferredVariantId,
          minPrice,
          maxPrice,
        });
        const promotion = variant?.VariantPromotions?.[0];
        const originalPrice = Number(variant?.price_original ?? variant?.price ?? 0);
        let price = Number(variant?.price ?? 0);
        let discountPercent;

        if (promotion?.promotion_type === "discount_percent") {
          discountPercent = Number(promotion.discount_percent);
          price = originalPrice * (1 - discountPercent / 100);
        }

        const imageUrls = data?.ProductImages?.map((img) => img?.url).filter(Boolean) || [];
        setProductDetail({
          ...data,
          id: String(data.product_id),
          variantId: variant?.variant_id,
          preselectedVariantId: variant?.variant_id,
          name: data.name,
          description: data.description,
          price: Math.round(price),
          originalPrice: Math.round(originalPrice),
          discountPercent,
          sizes: data?.ProductVariants?.map((item) => item.size).filter(Boolean) || [],
          thicknesses: data?.ProductVariants?.map((item) => item.thickness).filter(Boolean) || [],
          images: imageUrls.length ? imageUrls : [PLACEHOLDER_IMAGE],
        });
      } catch (error) {
        console.error("Fetch product detail error:", error);
        setProductDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [productId, preferredVariantId, minPrice, maxPrice]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography >Đang tải...</Typography>
      </Container>
    );
  }

  if (!productDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography >Không tìm thấy sản phẩm.</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="100%">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductGallery images={productDetail.images} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProductInfo product={productDetail} />
        </Grid>
      </Grid>

      <ProductTabs description={productDetail.description} />
    </Container>
  );
}
