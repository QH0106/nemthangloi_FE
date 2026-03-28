import { Box, Typography, IconButton, Stack, Checkbox, Divider, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteProduct, DeleteAllProduct, } from "@/components/cart/DeleteProduct";

export default function CartItems({
  items,
  onUpdate,
  onToggleSelect,
  onSelectAll,
  onUnselectAll,
}) {
  const { deleteProduct } = DeleteProduct();
  const { deleteAllProduct } = DeleteAllProduct();

  const formatPromotion = (promotion) => {
    if (!promotion?.promotion_type) return null;

    if (promotion.promotion_type === "discount_amount") {
      return `Giảm ${Number(promotion.discount_amount || 0).toLocaleString()}₫`;
    }

    if (promotion.promotion_type === "discount_percent") {
      return `Giảm ${Number(promotion.discount_percent || 0)}%`;
    }

    if (promotion.promotion_type === "gift") {
      return `Quà tặng: ${promotion.gift_title || "Quà tặng kèm"}`;
    }

    return null;
  };

  if (!items.length) {
    return (
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid rgba(219,39,119,0.22)",
          bgcolor: "rgba(255,255,255,0.8)",
          textAlign: "center",
        }}
      >
        <Typography fontWeight={700} color="#831843" mb={0.5}>
          Giỏ hàng đang trống
        </Typography>
        <br />
        <Typography fontSize={14}>
          Hãy thêm sản phẩm để bắt đầu đặt hàng.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2.5 },
        borderRadius: 3,
        border: "1px solid rgba(219,39,119,0.2)",
        bgcolor: "rgba(255,255,255,0.78)",
        boxShadow: "0 14px 30px rgba(157, 23, 77, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Typography fontWeight={600} color="#831843" fontSize={20}>
          Sản phẩm đã chọn
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.6}>
          <Typography
            component="button"
            onClick={() => onSelectAll?.()}
            sx={{
              border: "none",
              background: "transparent",
              color: "#9d174d",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              px: 0.8,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { backgroundColor: "rgba(219,39,119,0.1)" },
            }}
          >
            Chọn tất cả
          </Typography>

          <Typography
            component="button"
            onClick={() => onUnselectAll?.()}
            sx={{
              border: "none",
              background: "transparent",
              color: "#9d174d",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              px: 0.8,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { backgroundColor: "rgba(219,39,119,0.1)" },
            }}
          >
            Bỏ chọn tất cả
          </Typography>

          <IconButton
            onClick={() => deleteAllProduct()}
            sx={{ color: "#be185d", "&:hover": { bgcolor: "rgba(219,39,119,0.12)" } }}
            aria-label="Xóa tất cả"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              p: 1.25,
              border: "1px solid rgba(219,39,119,0.18)",
              borderRadius: 2,
              bgcolor: item.selected !== false ? "#fff" : "rgba(255,255,255,0.66)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: { sm: 280 }, flex: 1 }}>
              <Checkbox
                checked={item.selected !== false}
                onChange={(e) => onToggleSelect?.(item.id, e.target.checked)}
                sx={{ color: "#db2777", "&.Mui-checked": { color: "#be185d" } }}
              />

              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: 84,
                  height: 84,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600} color="text.primary" noWrap>
                  {item.name}
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" rowGap={0.6} sx={{ mt: 0.8 }}>
                  {item.size ? (
                    <Chip
                      label={`Kích thước: ${item.size}`}
                      size="small"
                      sx={{ bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }}
                    />
                  ) : null}
                  {item.thickness ? (
                    <Chip
                      label={`Độ dày: ${item.thickness}`}
                      size="small"
                      sx={{ bgcolor: "rgba(190,24,93,0.1)", color: "#9d174d", fontWeight: 700 }}
                    />
                  ) : null}
                </Stack>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Đơn giá: {(item.unitPrice ?? item.price).toLocaleString()}₫
                </Typography>

                {Number(item.basePrice || 0) > Number(item.unitPrice || item.price || 0) && (
                  <Typography variant="caption" sx={{ display: "block", color: "#64748b", textDecoration: "line-through" }}>
                    Giá gốc: {Number(item.basePrice || 0).toLocaleString()}₫
                  </Typography>
                )}

                {item.selectedPromotion && (
                  <Chip
                    label={formatPromotion(item.selectedPromotion)}
                    size="small"
                    sx={{ mt: 0.8, bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }}
                  />
                )}

                {item.selectedPromotion?.promotion_type === "gift" && item.selectedPromotion?.gift_description && (
                  <Typography variant="caption" sx={{ display: "block", mt: 0.6, color: "#7a4b9e" }}>
                    {item.selectedPromotion.gift_description}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={{ xs: "space-between", sm: "flex-end" }}
              spacing={1.2}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  border: "1px solid rgba(148,163,184,0.4)",
                  borderRadius: 99,
                  px: 0.4,
                  py: 0.1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => item.quantity > 1 && onUpdate(item.id, item.quantity - 1)}
                  sx={{ color: "#475569" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 26, textAlign: "center", fontWeight: 700 }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => onUpdate(item.id, item.quantity + 1)}
                  sx={{ color: "#475569" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Typography fontWeight={800} color="#7e1644" sx={{ minWidth: 106, textAlign: "right" }}>
                {(item.price * item.quantity).toLocaleString()}₫
              </Typography>

              <IconButton
                onClick={() => deleteProduct(item.id, item.name)}
                sx={{ color: "#e11d48", "&:hover": { bgcolor: "rgba(244,63,94,0.12)" } }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
