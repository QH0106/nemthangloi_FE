import { Box, Typography, Divider } from "@mui/material";
export default function CartSummary({ items }) {
    const selectedItems = items.filter((i) => i.selected !== false);
    const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 10000000 ? 0 : 50000;
    const total = subtotal + shipping;
    return (<Box sx={{
            p: { xs: 2, md: 2.3 },
            border: "1px solid rgba(219,39,119,0.2)",
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.84)",
            color: "#0f172a",
            mt: 2,
        }}>
      <Typography fontWeight={600} color="#831843" fontSize={18} mb={1.5}>
        Tóm tắt đơn hàng
      </Typography>

      <Box display="flex" justifyContent="space-between" py={0.4}>
        <Typography>Tạm tính</Typography>
        <Typography fontWeight={600}>{subtotal.toLocaleString()}₫</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" py={0.4}>
        <Typography>Phí giao hàng</Typography>
        <Typography fontWeight={600} color={shipping === 0 ? "#059669" : "inherit"}>
          {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}₫`}
        </Typography>
      </Box>

      <Divider sx={{ my: 1.6 }}/>

      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight={600} fontSize={17}>Tổng cộng</Typography>
        <Typography fontWeight={600} fontSize={18} color="#7e1644">
          {total.toLocaleString()}₫
        </Typography>
      </Box>
    </Box>);
}
