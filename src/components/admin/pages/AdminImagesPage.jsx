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
  createImageAdminApi,
  deleteImageAdminApi,
  listImagesAdminApi,
  uploadImagesAdminApi,
  updateImageAdminApi,
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

const initialForm = { id: "", product_id: "", url: "", imageFile: null, is_main: "false" };

export default function AdminImagesPage() {
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
      const data = await listImagesAdminApi({ page: page + 1, limit: rowsPerPage });
      setItems(Array.isArray(data?.images) ? data.images : []);
      setTotalRows(Number(data?.pagination?.total || 0));
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, rowsPerPage]);

  const payload = { product_id: Number(form.product_id), url: form.url, is_main: form.is_main === "true" };

  const onCreate = async () => {
    if (!form.product_id || !form.imageFile) return notify("error", "Product ID và file ảnh là bắt buộc.");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("images", form.imageFile);

      const uploadedFiles = await uploadImagesAdminApi(formData);
      const uploadedUrl = uploadedFiles?.[0]?.url;

      if (!uploadedUrl) {
        notify("error", "Upload ảnh thất bại.");
        return;
      }

      await createImageAdminApi({
        product_id: Number(form.product_id),
        url: uploadedUrl,
        is_main: form.is_main === "true",
      });
      setForm(initialForm);
      await load();
      notify("success", "Tạo image thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Tạo image thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return notify("error", "Nhập ID để cập nhật.");
    try {
      setLoading(true);
      await updateImageAdminApi(Number(form.id), payload);
      await load();
      notify("success", "Cập nhật image thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Cập nhật image thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deleteImageAdminApi(id);
      const nextPage = page > 0 && items.length === 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) {
        await load();
      }
      notify("success", "Đã xóa image.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa image thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => { setForm(initialForm); setActiveItem(null); setModalMode("create"); setModalOpen(true); };
  const openViewModal = (item) => { setActiveItem(item); setModalMode("view"); setModalOpen(true); };
  const openEditModal = (item) => {
    setActiveItem(item);
    setForm({ id: String(item.image_id || ""), product_id: String(item.product_id || ""), url: item.url || "", imageFile: null, is_main: item.is_main ? "true" : "false" });
    setModalMode("edit");
    setModalOpen(true);
  };
  const openDeleteModal = (item) => { setActiveItem(item); setModalMode("delete"); setModalOpen(true); };
  const closeModal = () => { if (loading) return; setModalOpen(false); };

  const submitModal = async () => {
    if (modalMode === "create") { await onCreate(); setModalOpen(false); return; }
    if (modalMode === "edit") { await onUpdate(); setModalOpen(false); return; }
    if (modalMode === "delete" && activeItem?.image_id) { await onDelete(activeItem.image_id); setModalOpen(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>Quản lý Hình ảnh</Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>{totalRows} hình ảnh</Typography>
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
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>Danh sách hình ảnh</Typography>
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Product ID</TableCell>
                <TableCell sx={S.theadCell}>URL</TableCell>
                <TableCell sx={S.theadCell}>Ảnh chính</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.image_id} sx={{ "&:hover": { background: "#1e293b" } }}>
                  <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.image_id}</TableCell>
                  <TableCell sx={S.bodyCell}>{item.product_id}</TableCell>
                  <TableCell sx={{ ...S.bodyCell, maxWidth: 280 }}>
                    <Typography variant="body2" sx={{ color: "#60a5fa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.url}
                    </Typography>
                  </TableCell>
                  <TableCell sx={S.bodyCell}>
                    {item.is_main
                      ? <Chip label="Chính" size="small" sx={{ background: "rgba(52,211,153,0.15)", color: "#34d399", fontWeight: 600, fontSize: "11px", height: 20 }} />
                      : <Chip label="Phụ" size="small" sx={{ background: "rgba(100,116,139,0.15)", color: "#64748b", fontWeight: 600, fontSize: "11px", height: 20 }} />}
                  </TableCell>
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
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#475569", borderBottom: "none" }}>
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

      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Thêm hình ảnh"}
          {modalMode === "edit" && "Chỉnh sửa hình ảnh"}
          {modalMode === "view" && "Chi tiết hình ảnh"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <Stack spacing={2} mt={1}>
              <div className="grid grid-cols-2 gap-3 rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                {[["ID", activeItem?.image_id], ["Product ID", activeItem?.product_id], ["Ảnh chính", activeItem?.is_main ? "Có" : "Không"]].map(([label, value]) => (
                  <div key={label}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value ?? "—"}</Typography>
                  </div>
                ))}
              </div>
              {activeItem?.url && (
                <div className="rounded-xl p-3" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1 }}>URL</Typography>
                  <Typography variant="body2" sx={{ color: "#60a5fa", wordBreak: "break-all" }}>{activeItem.url}</Typography>
                  <img src={activeItem.url} alt="preview" className="mt-3 rounded-lg object-cover" style={{ maxHeight: 180, width: "100%", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </div>
              )}
            </Stack>
          )}
          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa hình ảnh <strong>#{activeItem?.image_id}</strong>?
              </Typography>
            </div>
          )}
          {(modalMode === "create" || modalMode === "edit") && (
            <Stack spacing={2} mt={1}>
              {modalMode === "edit" && <TextField size="small" label="ID" value={form.id} disabled sx={{ ...tfSx, "& .MuiInputBase-root": { color: "#94a3b8", background: "#0f172a" } }} />}
              <TextField size="small" label="Product ID *" value={form.product_id} onChange={(e) => setForm((v) => ({ ...v, product_id: e.target.value }))} sx={tfSx} />
              {modalMode === "create" ? (
                <Stack spacing={1}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>Ảnh *</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((v) => ({ ...v, imageFile: e.target.files?.[0] || null }))}
                    style={{ color: "#cbd5e1" }}
                  />
                </Stack>
              ) : (
                <TextField size="small" label="URL *" value={form.url} onChange={(e) => setForm((v) => ({ ...v, url: e.target.value }))} sx={tfSx} />
              )}
              <TextField select size="small" label="Ảnh chính" value={form.is_main} onChange={(e) => setForm((v) => ({ ...v, is_main: e.target.value }))} sx={tfSx}>
                <MenuItem value="false" sx={{ color: "#f1f5f9", background: "#111827" }}>Ảnh phụ</MenuItem>
                <MenuItem value="true" sx={{ color: "#f1f5f9", background: "#111827" }}>Ảnh chính</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>Đóng</Button>
          {modalMode !== "view" && (
            <Button onClick={submitModal} variant="contained" disabled={loading}
              sx={{ bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1", "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" }, textTransform: "none", fontWeight: 600 }}>
              {modalMode === "create" && "Thêm hình ảnh"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
