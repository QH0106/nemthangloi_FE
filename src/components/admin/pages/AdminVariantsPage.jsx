import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  createVariantAdminApi,
  deleteVariantAdminApi,
  listVariantsAdminApi,
  updateVariantAdminApi,
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
};

const initialForm = { id: "", product_id: "", size: "", thickness: "", color: "", price: "", price_original: "", stock_qty: "" };

export default function AdminVariantsPage() {
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
      const data = await listVariantsAdminApi({ page: page + 1, limit: rowsPerPage });
      setItems(Array.isArray(data?.variants) ? data.variants : []);
      setTotalRows(Number(data?.pagination?.total || 0));
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được variants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, rowsPerPage]);

  const payload = {
    product_id: Number(form.product_id),
    size: form.size || undefined,
    thickness: form.thickness || undefined,
    color: form.color || undefined,
    price: Number(form.price),
    price_original: form.price_original ? Number(form.price_original) : undefined,
    stock_qty: form.stock_qty ? Number(form.stock_qty) : 0,
  };

  const onCreate = async () => {
    if (!form.product_id || !form.price) return notify("error", "Product ID và Price là bắt buộc.");
    try {
      setLoading(true);
      await createVariantAdminApi(payload);
      setForm(initialForm);
      await load();
      notify("success", "Tạo variant thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Tạo variant thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return notify("error", "Nhập ID để cập nhật.");
    try {
      setLoading(true);
      await updateVariantAdminApi(Number(form.id), payload);
      await load();
      notify("success", "Cập nhật variant thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Cập nhật variant thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deleteVariantAdminApi(id);
      const nextPage = page > 0 && items.length === 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) {
        await load();
      }
      notify("success", "Đã xóa variant.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa variant thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => { setForm(initialForm); setActiveItem(null); setModalMode("create"); setModalOpen(true); };
  const openViewModal = (item) => { setActiveItem(item); setModalMode("view"); setModalOpen(true); };
  const openEditModal = (item) => {
    setActiveItem(item);
    setForm({ id: String(item.variant_id || ""), product_id: String(item.product_id || ""), size: item.size || "", thickness: item.thickness || "", color: item.color || "", price: String(item.price ?? ""), price_original: String(item.price_original ?? ""), stock_qty: String(item.stock_qty ?? "") });
    setModalMode("edit");
    setModalOpen(true);
  };
  const openDeleteModal = (item) => { setActiveItem(item); setModalMode("delete"); setModalOpen(true); };
  const closeModal = () => { if (loading) return; setModalOpen(false); };

  const submitModal = async () => {
    if (modalMode === "create") { await onCreate(); setModalOpen(false); return; }
    if (modalMode === "edit") { await onUpdate(); setModalOpen(false); return; }
    if (modalMode === "delete" && activeItem?.variant_id) { await onDelete(activeItem.variant_id); setModalOpen(false); }
  };

  const fmt = (v) => v ?? <span style={{ color: "#475569" }}>-</span>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>Quản lý Biến thể</Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>{totalRows} biến thể</Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} disabled={loading} size="small"
            sx={{ borderColor: "#334155", color: "#94a3b8", "&:hover": { borderColor: "#6366f1", color: "#6366f1" }, textTransform: "none" }}>Làm mới</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal} size="small"
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none" }}>Thêm mới</Button>
        </Stack>
      </div>

      {message.text ? <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>{message.text}</Alert> : null}

      <div style={S.card}>
        <div className="px-5 py-4">
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>Danh sách biến thể</Typography>
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Product ID</TableCell>
                <TableCell sx={S.theadCell}>Kích thước</TableCell>
                <TableCell sx={S.theadCell}>Độ dày</TableCell>
                <TableCell sx={S.theadCell}>Màu sắc</TableCell>
                <TableCell sx={S.theadCell}>Giá</TableCell>
                <TableCell sx={S.theadCell}>Gốc</TableCell>
                <TableCell sx={S.theadCell}>Tồn kho</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.variant_id} sx={{ "&:hover": { background: "#1e293b" } }}>
                  <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.variant_id}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.product_id}</TableCell>
                  <TableCell sx={S.bodyCell}>{fmt(item.size)}</TableCell>
                  <TableCell sx={S.bodyCell}>{fmt(item.thickness)}</TableCell>
                  <TableCell sx={S.bodyCell}>{fmt(item.color)}</TableCell>
                  <TableCell sx={{ ...S.bodyCell, color: "#34d399", fontWeight: 600 }}>{item.price ? item.price.toLocaleString("vi-VN") : "-"}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.price_original ? item.price_original.toLocaleString("vi-VN") : "-"}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.stock_qty ?? <span style={{ color: "#475569" }}>-</span>}</TableCell>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: "#475569", borderBottom: "none" }}>
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

      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="md"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Tạo biến thể mới"}
          {modalMode === "edit" && "Chỉnh sửa biến thể"}
          {modalMode === "view" && "Chi tiết biến thể"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <div className="grid grid-cols-2 gap-3 rounded-xl p-4 mt-1" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              {[["ID", activeItem?.variant_id], ["Product ID", activeItem?.product_id], ["Kích thước", activeItem?.size], ["Độ dày", activeItem?.thickness], ["Màu sắc", activeItem?.color], ["Giá", activeItem?.price], ["Giá gốc", activeItem?.price_original], ["Tồn kho", activeItem?.stock_qty]].map(([label, value]) => (
                <div key={label}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                  <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value ?? "-"}</Typography>
                </div>
              ))}
            </div>
          )}
          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa biến thể <strong>#{activeItem?.variant_id}</strong>?
              </Typography>
            </div>
          )}
          {(modalMode === "create" || modalMode === "edit") && (
            <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-2">
              {modalMode === "edit" && <TextField size="small" label="ID" value={form.id} disabled sx={{ ...tfSx, "& .MuiInputBase-root": { color: "#94a3b8", background: "#0f172a" } }} />}
              {[["product_id", "Product ID *"], ["size", "Kích thước"], ["thickness", "Độ dày"], ["color", "Màu sắc"], ["price", "Giá *"], ["price_original", "Giá gốc"], ["stock_qty", "Tồn kho"]].map(([key, lbl]) => (
                <TextField key={key} size="small" label={lbl} value={form[key]} onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))} sx={tfSx} />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>Đóng</Button>
          {modalMode !== "view" && (
            <Button onClick={submitModal} variant="contained" disabled={loading}
              sx={{ bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1", "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" }, textTransform: "none", fontWeight: 600 }}>
              {modalMode === "create" && "Tạo biến thể"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
