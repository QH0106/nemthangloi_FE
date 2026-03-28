import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, Chip, Stack, Checkbox } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Addtocart, getPromotionPriceAdjustment } from "@/components/cart/AddToCart";

export default function ProductInfo({ product }) {
  const navigate = useNavigate();
  const uniqueThicknesses = useMemo(
    () => [...new Set(product?.thicknesses ?? [])],
    [product?.thicknesses],
  );
  const uniqueSizes = useMemo(
    () => [...new Set(product?.sizes ?? [])],
    [product?.sizes],
  );

  const preferredVariant = useMemo(() => {
    if (!Array.isArray(product?.ProductVariants) || !product.ProductVariants.length) {
      return null;
    }

    return (
      product.ProductVariants.find(
        (variant) =>
          String(variant?.variant_id) === String(product?.preselectedVariantId),
      ) ?? product.ProductVariants[0]
    );
  }, [product?.ProductVariants, product?.preselectedVariantId]);

  const [quantity, setQuantity] = useState(1);
  const [selectedThickness, setSelectedThickness] = useState(
    preferredVariant?.thickness ?? uniqueThicknesses[0],
  );
  const [selectedSize, setSelectedSize] = useState(
    preferredVariant?.size ?? uniqueSizes[0],
  );

  useEffect(() => {
    setSelectedThickness(preferredVariant?.thickness ?? uniqueThicknesses[0]);
    setSelectedSize(preferredVariant?.size ?? uniqueSizes[0]);
    setQuantity(1);
  }, [product?.id, product?.preselectedVariantId]);

  const selectedVariant =
    product.ProductVariants?.find(
      (v) =>
        String(v?.size).trim() === String(selectedSize).trim() &&
        String(v?.thickness).trim() === String(selectedThickness).trim(),
    ) ?? preferredVariant ?? product.ProductVariants?.[0];

  const selectedPromotions = Array.isArray(selectedVariant?.VariantPromotions)
    ? selectedVariant.VariantPromotions
    : [];

  const getPromotionKey = (promotion, index) =>
    String(promotion?.promotion_id ?? `${promotion?.promotion_type || "promo"}-${index}`);

  const [selectedPromotionKey, setSelectedPromotionKey] = useState("");

  useEffect(() => {
    if (!selectedPromotions.length) {
      setSelectedPromotionKey("");
      return;
    }

    const giftIndex = selectedPromotions.findIndex(
      (promotion) => promotion?.promotion_type === "gift",
    );

    const defaultIndex = giftIndex >= 0 ? giftIndex : 0;
    setSelectedPromotionKey(
      getPromotionKey(selectedPromotions[defaultIndex], defaultIndex),
    );
  }, [selectedVariant?.variant_id, selectedPromotions.length]);

  const selectedPromotion = selectedPromotions.find(
    (promotion, index) => getPromotionKey(promotion, index) === selectedPromotionKey,
  ) || null;

  const basePrice = selectedVariant?.price ?? product.price;
  const { finalPrice: price } = getPromotionPriceAdjustment(basePrice, selectedPromotion);
  const originalPrice =
    selectedVariant?.price_original ?? product.originalPrice;
  const computedDiscountPercent = (() => {
    const origin = Number(originalPrice) || 0;
    const current = Number(price) || 0;
    if (origin <= 0 || current >= origin) return 0;
    return Math.round(((origin - current) / origin) * 100);
  })();

  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const formatPromotionValue = (promotion) => {
    if (!promotion) return "";

    if (promotion.promotion_type === "discount_percent") {
      return `Giảm ${Number(promotion.discount_percent ?? 0)}%`;
    }

    if (promotion.promotion_type === "discount_amount") {
      return `Giảm ${currencyFormatter.format(Number(promotion.discount_amount ?? 0))} `;
    }

    if (promotion.promotion_type === "gift") {
      return `Quà tặng: `;
    }

    return "Ưu đãi đặc biệt";
  };

  const formatPromotionTime = (promotion) => {
    const start = promotion?.start_date || promotion?.start_at || promotion?.starts_at;
    const end = promotion?.end_date || promotion?.end_at || promotion?.expires_at;

    if (!start && !end) return null;

    const formatDate = (value) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      return new Intl.DateTimeFormat("vi-VN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(parsed);
    };

    const startText = start ? formatDate(start) : null;
    const endText = end ? formatDate(end) : null;

    if (startText && endText) return ` Áp dụng:  ${startText} - ${endText}`;
    if (startText) return `Bắt đầu: ${startText}`;
    if (endText) return `Kết thúc: ${endText}`;
    return null;
  };

  const formatGiftDescription = (promotion) => {
    if (promotion?.promotion_type !== "gift") return null;

    const description =
      promotion?.gift_description ||
      promotion?.description ||
      promotion?.gift_note ||
      "";

    return String(description).trim() || null;
  };

  return (
    <Box>
      {product.badge && (
        <Box display="flex" justifyContent="flex-start" mt={5} mb={1}>
          <Chip
            label={product.badge}
            size="small"
            sx={{
              height: 24,
              px: 1,
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#d3543c",
              borderRadius: "0 6px 6px 0",

              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>
      )}

      <Typography
        variant="h4"
        color="#000000"
        align="left"
        fontWeight={600}
        fontSize={30}
        gap={1}
        mt={2}
      >
        {product.name}
      </Typography>

      <Box bgcolor={"#f4f7ff"} borderRadius={2} p={2} mt={2}>
        {product.thicknesses && product.thicknesses.length > 0 && (
          <Stack display="flex" alignItems="start" gap={2} mb={2}>
            <Typography color="#000000" fontWeight={400}>
              Độ dày:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} sx={{ width: "100%" }}>
              {uniqueThicknesses.map((t) => (
                <Button
                  key={t}
                  variant="primary"
                  onClick={() => setSelectedThickness(t)}
                  sx={{
                    textTransform: "none",
                    borderColor: "divider",
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.75,
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",

                    bgcolor:
                      selectedThickness === t ? "#DE3E96" : "transparent",
                    color: selectedThickness === t ? "#fff" : "#000",
                  }}
                >
                  {t}
                </Button>
              ))}
            </Box>
          </Stack>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <Stack display="flex" alignItems="start" gap={2} mb={2}>
            <Typography color="#000000" fontWeight={400}>
              Kích thước:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} sx={{ width: "100%" }}>
              {uniqueSizes.map((s) => (
                <Button
                  key={s}
                  variant="primary"
                  onClick={() => setSelectedSize(s)}
                  sx={{
                    textTransform: "none",
                    borderColor: "divider",
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.75,
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",

                    bgcolor: selectedSize === s ? "#DE3E96" : "transparent",
                    color: selectedSize === s ? "#fff" : "#000",
                  }}
                >
                  {s}
                </Button>
              ))}
            </Box>
          </Stack>
        )}

        <Box mt={1} display="flex" alignItems="center" gap={1.5} marginTop={2}>
          <Typography fontWeight={400} color="#000000">
            Giá cũ:
          </Typography>

          <Typography
            sx={{
              textDecoration: "line-through",
              color: "#000000",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(originalPrice ?? 0)}
          </Typography>

          {computedDiscountPercent > 0 ? (
            <Box
              sx={{
                marginLeft: 3,
                px: 1.4,
                py: 0.5,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #ff1744 0%, #ff6d00 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                lineHeight: 1,
                boxShadow: "0 4px 12px rgba(255, 23, 68, 0.45)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              -{computedDiscountPercent}%
            </Box>
          ) : null}
        </Box>

        <Box display="flex" alignItems="center" mt={2} gap={1}>
          <Typography color="#000000" fontWeight={400}>
            Giá:
          </Typography>
          <Typography
            sx={{
              color: "#000000",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price ?? 0)}
          </Typography>
        </Box>
      </Box>

      <Box mt={3} display="flex" alignItems="center" gap={2}>
        <Typography color="#000000" fontWeight={600}>
          Số lượng:
        </Typography>

        <Box display="flex" gap={1} alignItems="center">
          <Button
            size="small"
            variant="secondary"
            sx={{
              color: "text.primary",
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
            }}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>

          <Typography sx={{ width: 40, textAlign: "center", color: "#000" }}>
            {quantity}
          </Typography>

          <Button
            size="small"
            variant="secondary"
            sx={{
              color: "text.primary",
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
            }}
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </Button>

          <Button
            fullWidth
            size="small"
            sx={{
              ml: 4,
              color: "#DE3E96",
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
            }}
            onClick={() => {
              if (!selectedVariant?.variant_id) {
                toast.warning("Vui lòng chọn kích thước và độ dày phù hợp.");
                return;
              }
              Addtocart(selectedVariant.variant_id, quantity, product.name, basePrice, {
                size: selectedVariant?.size,
                thickness: selectedVariant?.thickness,
                variantLabel: `${selectedVariant?.size || ""} - ${selectedVariant?.thickness || ""}`.trim(),
                image: product?.images?.[0] || null,
                selectedPromotion,
              });
            }}
            disabled={!selectedVariant?.variant_id}
          >
            Thêm vào giỏ hàng
          </Button>
        </Box>
      </Box>

      <Button
        fullWidth
        size="large"
        variant="primary"
        sx={{
          mt: 4,
          "&:focus": { outline: "none" },
          "&:focus-visible": { outline: "none", boxShadow: "none" },
        }}
        onClick={async () => {
          if (!selectedVariant?.variant_id) {
            toast.warning("Vui lòng chọn kích thước và độ dày phù hợp.");
            return;
          }

          const added = await Addtocart(selectedVariant.variant_id, quantity, product.name, basePrice, {
            size: selectedVariant?.size,
            thickness: selectedVariant?.thickness,
            variantLabel: `${selectedVariant?.size || ""} - ${selectedVariant?.thickness || ""}`.trim(),
            image: product?.images?.[0] || null,
            selectedPromotion,
          });

          if (!added) return;

          navigate("/cartPage", {
            state: {
              buyNowVariantId: selectedVariant.variant_id,
            },
          });
        }}
      >
        Thanh toán ngay
      </Button>

      {selectedPromotions.length > 0 && (
        <Box
          mt={2}
          p={2}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(180deg, #f9f3ff 0%, #f4f7ff 100%)",
            border: "1px solid #eadbff",
            boxShadow: "0 6px 16px rgba(222, 62, 150, 0.08)",
          }}
        >
          <Typography fontWeight={700} color="#9B2C74" mb={1}>
            Chọn 1 khuyến mãi cho biến thể đang chọn
          </Typography>

          <Stack spacing={1}>
            {selectedPromotions.map((promotion, index) => {
              const timeText = formatPromotionTime(promotion);
              const giftDescription = formatGiftDescription(promotion);
              const promotionKey = getPromotionKey(promotion, index);
              const checked = selectedPromotionKey === promotionKey;

              return (
                <Box
                  key={promotion?.promotion_id || `${promotion?.promotion_type || "promo"}-${index}`}
                  onClick={() => setSelectedPromotionKey(promotionKey)}
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    backgroundColor: "rgba(255,255,255,0.92)",
                    border: "1px solid #f0e3ff",
                    borderLeft: "4px solid #DE3E96",
                    cursor: "pointer",
                    boxShadow: checked ? "0 0 0 2px rgba(222, 62, 150, 0.18)" : "none",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Checkbox
                      checked={checked}
                      onChange={() => setSelectedPromotionKey(promotionKey)}
                      sx={{ color: "#de3e96", "&.Mui-checked": { color: "#be185d" }, p: 0.4 }}
                    />
                    <Typography fontSize={14} fontWeight={700} color="#6B1D53">
                      {formatPromotionValue(promotion)}
                    </Typography>
                  </Box>

                  {giftDescription && (
                    <Typography fontSize={12} color="#6B7280" mt={0.5}>
                      {giftDescription}
                    </Typography>
                  )}

                  {timeText && (
                    <Typography fontSize={12} color="#7A4B9E" mt={0.5}>
                      {timeText}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
