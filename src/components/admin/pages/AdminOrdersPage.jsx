import { useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getOrderByCodeAdminApi, placeOrderAdminApi } from "@/api/admin.api";

const S = {
  card: { background: "#111827", border: "1px solid #1e293b", borderRadius: 16 },
  thead: { background: "#0f172a" },
  theadCell: { color: "#64748b", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #1e293b" },
  bodyCell: { color: "#cbd5e1", borderBottom: "1px solid #1e293b" },
};

const tfSx = {
  "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
};

const statusColors = {
  pending: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  confirmed: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
  cancelled: { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  default: { bg: "rgba(100,116,139,0.12)", color: "#94a3b8" },
};

export default function AdminOrdersPage() {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const notify = (type, text) => setMessage({ type, text });
  const formatVnd = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;
    return `${amount.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫`;
  };

  const onLoad = async () => {
    if (!orderCode?.trim()) return notify("error", "Nhập mã đơn.");
    try {
      setLoading(true);
      const data = await getOrderByCodeAdminApi(orderCode.trim());
      setOrder(data);
      notify("success", "Đã tải đơn hàng.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!order?.order_id) return notify("error", "Hãy tải đơn hàng theo mã đơn trước.");
    try {
      setLoading(true);
      const data = await placeOrderAdminApi(order.order_id, { payment_method: "cod" });
      setOrder(data);
      notify("success", "Xác nhận đơn hàng thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xác nhận đơn hàng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (s) => statusColors[s] || statusColors.default;

  return (
    <div className="space-y-5">
      <div>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>Quản lý Đơn hàng</Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>Tra cứu và xác nhận đơn hàng theo ID</Typography>
      </div>

      {message.text ? <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>{message.text}</Alert> : null}

      {/* Search card */}
      <div className="rounded-2xl p-5" style={{ background: "#111827", border: "1px solid #1e293b" }}>
        <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600, mb: 2 }}>Tìm đơn hàng</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
          <TextField
            size="small"
            label="Mã đơn"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLoad()}
            sx={{ ...tfSx, minWidth: 180 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onLoad}
            disabled={loading}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none", fontWeight: 600 }}
          >
            Tải đơn hàng
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={onConfirm}
            disabled={loading || !order}
            sx={{ borderColor: "#334155", color: "#34d399", "&:hover": { borderColor: "#34d399", background: "rgba(52,211,153,0.08)" }, textTransform: "none" }}
          >
            Xác nhận (COD)
          </Button>
        </Stack>
      </div>

      {/* Order details */}
      {order ? (
        <div className="space-y-4">
          {/* Order summary */}
          <div className="rounded-2xl p-5" style={{ background: "#111827", border: "1px solid #1e293b" }}>
            <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600, mb: 3 }}>Thông tin đơn hàng</Typography>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Mã đơn", order.order_code],
                ["Khách hàng", order.customer_name],
                ["Email", order.customer_email],
                ["Tổng tiền", formatVnd(order.total_amount)],
              ].map(([label, value]) => (
                <div key={label}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value || "—"}</Typography>
                </div>
              ))}
              <div>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>Trạng thái</Typography>
                <Chip
                  label={order.status || "—"}
                  size="small"
                  sx={{ mt: 0.5, background: statusStyle(order.status).bg, color: statusStyle(order.status).color, fontWeight: 700, fontSize: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div style={S.card}>
            <div className="px-5 py-4">
              <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>Danh sách sản phẩm</Typography>
            </div>
            <TableContainer>
              <Table size="small">
                <TableHead sx={S.thead}>
                  <TableRow>
                    <TableCell sx={S.theadCell}>Order Item ID</TableCell>
                    <TableCell sx={S.theadCell}>Variant ID</TableCell>
                    <TableCell sx={S.theadCell}>Số lượng</TableCell>
                    <TableCell sx={S.theadCell}>Đơn giá</TableCell>
                    <TableCell sx={S.theadCell}>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(order.OrderItems || []).map((item) => (
                    <TableRow key={item.order_item_id} sx={{ "&:hover": { background: "#1e293b" } }}>
                      <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.order_item_id}</TableCell>
                      <TableCell sx={S.bodyCell}>{item.product_variant_id}</TableCell>
                      <TableCell sx={S.bodyCell}>{item.quantity}</TableCell>
                      <TableCell sx={{ ...S.bodyCell, color: "#34d399" }}>{formatVnd(item.price)}</TableCell>
                      <TableCell sx={{ ...S.bodyCell, color: "#f1f5f9", fontWeight: 600 }}>{formatVnd(item.line_total)}</TableCell>
                    </TableRow>
                  ))}
                  {(order.OrderItems || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#475569", borderBottom: "none" }}>Không có sản phẩm.</TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
