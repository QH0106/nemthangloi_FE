import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  createPromotionAdminApi,
  deletePromotionAdminApi,
  listPromotionsAdminApi,
  updatePromotionAdminApi,
} from "@/api/admin.api";

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
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
  "& .MuiSelect-icon": { color: "#64748b" },
};

const initialForm = {
  id: "",
  variant_id: "",
  promotion_type: "discount_percent",
  discount_amount: "",
  discount_percent: "",
  gift_title: "",
};

export default function AdminPromotionsPage() {
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeItem, setActiveItem] = useState(null);

  const notify = (type, text) => setMessage({ type, text });

  const load = async () => {
    try {
      setLoading(true);
      const data = await listPromotionsAdminApi({ page: page + 1, limit: rowsPerPage });
      setItems(Array.isArray(data?.promotions) ? data.promotions : []);
      setTotalRows(Number(data?.pagination?.total || 0));
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được promotions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, rowsPerPage]);

  const payload = {
    variant_id: Number(form.variant_id),
    promotion_type: form.promotion_type,
    discount_amount: form.promotion_type === "discount_amount" && form.discount_amount ? Number(form.discount_amount) : undefined,
    discount_percent: form.promotion_type === "discount_percent" && form.discount_percent ? Number(form.discount_percent) : undefined,
    gift_title: form.promotion_type === "gift" ? form.gift_title || undefined : undefined,
  };

  const onCreate = async () => {
    if (!form.variant_id) return notify("error", "Variant ID là bắt buộc.");
    try {
      setLoading(true);
      await createPromotionAdminApi(payload);
      setForm(initialForm);
      await load();
      notify("success", "Tạo promotion thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Tạo promotion thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return notify("error", "Nhập ID để cập nhật.");
    try {
      setLoading(true);
      await updatePromotionAdminApi(Number(form.id), payload);
      await load();
      notify("success", "Cập nhật promotion thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Cập nhật promotion thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deletePromotionAdminApi(id);
      const nextPage = page > 0 && items.length === 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) {
        await load();
      }
      notify("success", "Đã xóa promotion.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa promotion thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => { setForm(initialForm); setActiveItem(null); setModalMode("create"); setModalOpen(true); };
  const openViewModal = (item) => { setActiveItem(item); setModalMode("view"); setModalOpen(true); };
  const openEditModal = (item) => {
    setActiveItem(item);
    setForm({ id: String(item.promotion_id || ""), variant_id: String(item.variant_id || ""), promotion_type: item.promotion_type || "discount_percent", discount_amount: String(item.discount_amount ?? ""), discount_percent: String(item.discount_percent ?? ""), gift_title: item.gift_title || "" });
    setModalMode("edit");
    setModalOpen(true);
  };
  const openDeleteModal = (item) => { setActiveItem(item); setModalMode("delete"); setModalOpen(true); };
  const closeModal = () => { if (loading) return; setModalOpen(false); };

  const submitModal = async () => {
    if (modalMode === "create") { await onCreate(); setModalOpen(false); return; }
    if (modalMode === "edit") { await onUpdate(); setModalOpen(false); return; }
    if (modalMode === "delete" && activeItem?.promotion_id) { await onDelete(activeItem.promotion_id); setModalOpen(false); }
  };

  const typeOptions = [
    { value: "discount_amount", label: "Giảm số tiền" },
    { value: "discount_percent", label: "Giảm phần trăm" },
    { value: "gift", label: "Quà tặng" },
  ];

  const typeChipColor = { discount_percent: { bg: "#1e3a5f", color: "#60a5fa" }, discount_amount: { bg: "#1a3a2a", color: "#34d399" }, gift: { bg: "#3a1a3a", color: "#e879f9" } };

  const getTypeLabel = (type) => typeOptions.find((item) => item.value === type)?.label || type;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>Quản lý Khuyến mãi</Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>{totalRows} khuyến mãi đang hoạt động</Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} disabled={loading} size="small"
            sx={{ borderColor: "#334155", color: "#94a3b8", "&:hover": { borderColor: "#6366f1", color: "#6366f1" }, textTransform: "none" }}>
            Làm mới
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal} size="small"
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none" }}>
            Thêm mới
          </Button>
        </Stack>
      </div>

      {message.text ? <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>{message.text}</Alert> : null}

      {/* Table */}
      <div style={S.card}>
        <div className="px-5 py-4">
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>Danh sách khuyến mãi</Typography>
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Variant ID</TableCell>
                <TableCell sx={S.theadCell}>Loại</TableCell>
                <TableCell sx={S.theadCell}>Giảm tiền</TableCell>
                <TableCell sx={S.theadCell}>Giảm %</TableCell>
                <TableCell sx={S.theadCell}>Quà tặng</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.promotion_id} sx={{ "&:hover": { background: "#1e293b" } }}>
                  <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.promotion_id}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.variant_id}</TableCell>
                  <TableCell sx={{ ...S.bodyCell }}>
                    <Chip
                      label={getTypeLabel(item.promotion_type)}
                      size="small"
                      sx={{
                        background: typeChipColor[item.promotion_type]?.bg || "#1e293b",
                        color: typeChipColor[item.promotion_type]?.color || "#94a3b8",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={S.bodyCell}>{item.discount_amount ?? <span style={{ color: "#475569" }}>-</span>}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.discount_percent != null ? `${item.discount_percent}%` : <span style={{ color: "#475569" }}>-</span>}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.gift_title || <span style={{ color: "#475569" }}>-</span>}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: "1px solid #1e293b", pr: 2 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Chỉnh sửa"><IconButton size="small" sx={{ color: "#fbbf24", "&:hover": { background: "rgba(251,191,36,0.1)" } }} onClick={() => openEditModal(item)}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                      <Tooltip title="Chi tiết"><IconButton size="small" sx={{ color: "#60a5fa", "&:hover": { background: "rgba(96,165,250,0.1)" } }} onClick={() => openViewModal(item)}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: "#f87171", "&:hover": { background: "rgba(248,113,113,0.1)" } }} onClick={() => openDeleteModal(item)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#475569", borderBottom: "none" }}>
                    {loading ? "Đang tải..." : "Không có dữ liệu."}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(_e, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          sx={{
            color: "#94a3b8",
            borderTop: "1px solid #1e293b",
            ".MuiTablePagination-selectIcon": { color: "#94a3b8" },
            ".MuiTablePagination-actions button": { color: "#94a3b8" },
          }}
        />
      </div>

      {/* Dialog */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="md"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Tạo khuyến mãi mới"}
          {modalMode === "edit" && "Chỉnh sửa khuyến mãi"}
          {modalMode === "view" && "Chi tiết khuyến mãi"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <div className="grid grid-cols-2 gap-3 rounded-xl p-4 mt-1" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              {[["ID", activeItem?.promotion_id], ["Variant ID", activeItem?.variant_id], ["Loại", activeItem?.promotion_type], ["Giảm tiền", activeItem?.discount_amount], ["Giảm %", activeItem?.discount_percent], ["Quà tặng", activeItem?.gift_title]].map(([label, value]) => (
                <div key={label}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value ?? "—"}</Typography>
                </div>
              ))}
            </div>
          )}
          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa promotion <strong>#{activeItem?.promotion_id}</strong>? Hành động này không thể hoàn tác.
              </Typography>
            </div>
          )}
          {(modalMode === "create" || modalMode === "edit") && (
            <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-2">
              {modalMode === "edit" && <TextField size="small" label="ID" value={form.id} disabled sx={{ ...tfSx, "& .MuiInputBase-root": { color: "#94a3b8", background: "#0f172a" } }} />}
              <TextField size="small" label="Variant ID" value={form.variant_id} onChange={(e) => setForm((v) => ({ ...v, variant_id: e.target.value }))} sx={tfSx} />
              <TextField select size="small" label="Loại promotion" value={form.promotion_type} onChange={(e) => setForm((v) => ({ ...v, promotion_type: e.target.value }))} sx={tfSx}>
                {typeOptions.map((option) => <MenuItem key={option.value} value={option.value} sx={{ color: "#f1f5f9", background: "#111827" }}>{option.label}</MenuItem>)}
              </TextField>
              <TextField size="small" label="Giảm số tiền" value={form.discount_amount} disabled={form.promotion_type !== "discount_amount"} onChange={(e) => setForm((v) => ({ ...v, discount_amount: e.target.value }))} sx={tfSx} />
              <TextField size="small" label="Giảm phần trăm (%)" value={form.discount_percent} disabled={form.promotion_type !== "discount_percent"} onChange={(e) => setForm((v) => ({ ...v, discount_percent: e.target.value }))} sx={tfSx} />
              <TextField size="small" label="Tên quà tặng" value={form.gift_title} disabled={form.promotion_type !== "gift"} onChange={(e) => setForm((v) => ({ ...v, gift_title: e.target.value }))} sx={tfSx} />
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>Đóng</Button>
          {modalMode !== "view" && (
            <Button onClick={submitModal} variant="contained" disabled={loading}
              sx={{ bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1", "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" }, textTransform: "none", fontWeight: 600 }}>
              {modalMode === "create" && "Tạo khuyến mãi"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
