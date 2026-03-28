import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Addtocart } from "@/components/cart/AddToCart";
import { mapProductToCard } from "@/lib/utils";
import GenericProductCard from "../home/Products/card/GenericProductCard";

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

const getVariantDiscountPercent = (variant) => {
  const promotion = variant?.VariantPromotions?.[0];
  if (promotion?.promotion_type !== "discount_percent") return undefined;
  const discountPercent = Number(promotion.discount_percent ?? 0);
  return discountPercent > 0 ? discountPercent : undefined;
};

const findPreferredVariant = (product, priceRange) => {
  const variants = Array.isArray(product?.ProductVariants)
    ? product.ProductVariants
    : [];
  if (!variants.length) return null;

  const [minPrice, maxPrice] = Array.isArray(priceRange)
    ? priceRange
    : [undefined, undefined];

  const matchedByPrice = variants.find((variant) => {
    const finalPrice = getFinalVariantPrice(variant);
    const meetsMin = typeof minPrice !== "number" || finalPrice >= minPrice;
    const meetsMax = typeof maxPrice !== "number" || finalPrice <= maxPrice;
    return meetsMin && meetsMax;
  });

  return matchedByPrice ?? variants[0];
};

export default function ProductsGrid({ products, loading, priceRange }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 4, mb: 4, width: "100%" }}>
        Đang tải sản phẩm...
      </Typography>
    );
  }

  if (!loading && (!products || products.length === 0)) {
    return (
      <Typography align="center" sx={{ mt: 4, mb: 4, width: "100%" }}>
        Không có sản phẩm nào.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((item, index) => {
        const card = mapProductToCard(item);
        const preferredVariant = findPreferredVariant(item, priceRange);
        const preferredPrice = getFinalVariantPrice(preferredVariant);
        const preferredDiscountPercent = getVariantDiscountPercent(preferredVariant);

        const query = new URLSearchParams();
        if (preferredVariant?.variant_id) {
          query.set("variantId", String(preferredVariant.variant_id));
        }
        if (Array.isArray(priceRange) && priceRange.length === 2) {
          query.set("minPrice", String(priceRange[0]));
          query.set("maxPrice", String(priceRange[1]));
        }

        const detailPath = `/product/${card.id}${query.toString() ? `?${query.toString()}` : ""}`;

        if (!card?.id) return null;

        return (
          <Grid
            size={{ xs: 6, sm: 4, md: 3 }}
            key={card.id}
            // data-aos={index % 2 === 0 ? "fade-up-left" : "fade-down-right"}
          >
            <GenericProductCard
              id={card.id}
              href={detailPath}
              title={card.title}
              originalPrice={
                preferredDiscountPercent && preferredVariant?.price_original
                  ? Number(preferredVariant.price_original)
                  : card.originalPrice
              }
              discountPercent={preferredDiscountPercent ?? card.discountPercent}
              price={preferredPrice || card.price}
              image={card.image}
              hoverImage={card.hoverImage}
              onAddToCart={() => {
                const promotion = preferredVariant?.VariantPromotions?.find(p => p.promotion_type === "gift") || preferredVariant?.VariantPromotions?.[0] || null;
                Addtocart(
                  preferredVariant?.variant_id ?? card.variantId ?? card.id,
                  1,
                  card.title,
                  preferredPrice || card.price,
                  {
                    size: preferredVariant?.size ?? card?.size,
                    thickness: preferredVariant?.thickness ?? card?.thickness,
                    variantLabel:
                      `${preferredVariant?.size || ""} - ${preferredVariant?.thickness || ""}`.trim() ||
                      card?.variantLabel ||
                      `${preferredVariant?.size || card?.size || ""} - ${preferredVariant?.thickness || card?.thickness || ""}`.trim(),
                    image: card.image,
                    selectedPromotion: promotion,
                  },
                );
              }}
              onQuickView={() => navigate(detailPath)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
