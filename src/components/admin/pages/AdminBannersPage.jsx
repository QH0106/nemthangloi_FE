import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
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
  createBannerAdminApi,
  deleteBannerAdminApi,
  listBannersAdminApi,
  updateBannerAdminApi,
  uploadImagesAdminApi,
} from "@/api/admin.api";

const S = {
  card: { background: "#111827", border: "1px solid #1e293b", borderRadius: 16 },
  thead: { background: "#0f172a" },
  theadCell: {
    color: "#64748b",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #1e293b",
  },
  bodyCell: { color: "#cbd5e1", borderBottom: "1px solid #1e293b" },
};

const tfSx = {
  "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
};

const initialForm = {
  id: "",
  title: "",
  tag: "",
  description: "",
  image: "",
  button: "",
  link_url: "",
  banner_type: "promo",
  sort_order: 0,
  is_active: true,
};

const bannerTypeOptions = [
  { value: "promo", label: "Promo Banner" },
  { value: "product", label: "Product Banner" },
  { value: "discover", label: "Discover Section" },
];

const getBannerTypeLabel = (type) => {
  if (type === "product") return "Product";
  if (type === "discover") return "Discover";
  return "Promo";
};

const getBannerTypeColor = (type) => {
  if (type === "product") return "#1d4ed8";
  if (type === "discover") return "#0f766e";
  return "#7c3aed";
};

export default function AdminBannersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeItem, setActiveItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const notify = (type, text) => setMessage({ type, text });

  const load = async () => {
    try {
      setLoading(true);
      const params = { include_inactive: true };
      if (filterType !== "all") params.banner_type = filterType;
      const data = await listBannersAdminApi(params);
      setItems(Array.isArray(data?.banners) ? data.banners : []);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterType]);

  const pagedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
  }, [items, page, rowsPerPage]);

  const buildPayload = (stateForm) => ({
    title: stateForm.title,
    tag: stateForm.tag || null,
    description: stateForm.description || null,
    image: stateForm.image,
    button: stateForm.button || null,
    link_url: stateForm.link_url || null,
    banner_type: stateForm.banner_type,
    sort_order: Number(stateForm.sort_order || 0),
    is_active: Boolean(stateForm.is_active),
  });

  const onCreate = async () => {
    if (!form.title.trim()) return notify("error", "Tiêu đề là bắt buộc.");
    if (!form.image.trim()) return notify("error", "Ảnh banner là bắt buộc.");

    try {
      setLoading(true);
      await createBannerAdminApi(buildPayload(form));
      setForm(initialForm);
      await load();
      notify("success", "Tạo banner thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Tạo banner thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return notify("error", "Thiếu banner ID.");
    if (!form.title.trim()) return notify("error", "Tiêu đề là bắt buộc.");
    if (!form.image.trim()) return notify("error", "Ảnh banner là bắt buộc.");

    try {
      setLoading(true);
      await updateBannerAdminApi(Number(form.id), buildPayload(form));
      await load();
      notify("success", "Cập nhật banner thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Cập nhật banner thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deleteBannerAdminApi(id);
      await load();
      notify("success", "Đã xóa banner.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa banner thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("images", file);
      const uploaded = await uploadImagesAdminApi(formData);
      const first = Array.isArray(uploaded) ? uploaded[0] : null;
      const imageUrl = first?.url || first?.secure_url || first?.path || "";

      if (!imageUrl) {
        notify("error", "Upload ảnh thất bại.");
        return;
      }

      setForm((prev) => ({ ...prev, image: imageUrl }));
      notify("success", "Upload ảnh thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Upload ảnh thất bại.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setActiveItem(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openViewModal = (item) => {
    setActiveItem(item);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setActiveItem(item);
    setForm({
      id: String(item.banner_id || ""),
      title: item.title || "",
      tag: item.tag || "",
      description: item.description || "",
      image: item.image || "",
      button: item.button || "",
      link_url: item.link_url || "",
      banner_type: item.banner_type || "promo",
      sort_order: Number(item.sort_order || 0),
      is_active: Boolean(item.is_active),
    });
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setActiveItem(item);
    setModalMode("delete");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (loading) return;
    setModalOpen(false);
  };

  const submitModal = async () => {
    if (modalMode === "create") {
      await onCreate();
      setModalOpen(false);
      return;
    }

    if (modalMode === "edit") {
      await onUpdate();
      setModalOpen(false);
      return;
    }

    if (modalMode === "delete" && activeItem?.banner_id) {
      await onDelete(activeItem.banner_id);
      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>
            Quản lý Banner
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            {items.length} banners
          </Typography>
        </div>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Loại banner"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(0);
            }}
            sx={{ ...tfSx, minWidth: 160 }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            {bannerTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            disabled={loading}
            size="small"
            sx={{
              borderColor: "#334155",
              color: "#94a3b8",
              "&:hover": { borderColor: "#6366f1", color: "#6366f1" },
              textTransform: "none",
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            size="small"
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none" }}
          >
            Thêm banner
          </Button>
        </Stack>
      </div>

      {message.text ? (
        <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      ) : null}

      <div style={S.card}>
        <div className="px-5 py-4">
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>
            Danh sách banner
          </Typography>
        </div>

        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Tiêu đề</TableCell>
                <TableCell sx={S.theadCell}>Loại</TableCell>
                <TableCell sx={S.theadCell}>Ảnh</TableCell>
                <TableCell sx={S.theadCell}>Thứ tự</TableCell>
                <TableCell sx={S.theadCell}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pagedItems.map((item) => (
                <TableRow key={item.banner_id} sx={{ "&:hover": { background: "#1e293b" } }}>
                  <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>
                    {item.banner_id}
                  </TableCell>
                  <TableCell sx={{ ...S.bodyCell, color: "#f1f5f9", fontWeight: 500 }}>
                    {item.title}
                  </TableCell>
                  <TableCell sx={S.bodyCell}>
                    <Chip
                      size="small"
                      label={getBannerTypeLabel(item.banner_type)}
                      sx={{
                        background: getBannerTypeColor(item.banner_type),
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={S.bodyCell}>
                    {item.image ? (
                      <a href={item.image} target="_blank" rel="noreferrer" style={{ color: "#93c5fd" }}>
                        Xem ảnh
                      </a>
                    ) : (
                      <span style={{ color: "#475569" }}>-</span>
                    )}
                  </TableCell>
                  <TableCell sx={S.bodyCell}>{Number(item.sort_order || 0)}</TableCell>
                  <TableCell sx={S.bodyCell}>
                    <Chip
                      size="small"
                      label={item.is_active ? "Active" : "Inactive"}
                      sx={{
                        background: item.is_active ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)",
                        color: item.is_active ? "#4ade80" : "#fca5a5",
                        border: `1px solid ${item.is_active ? "#15803d" : "#b91c1c"}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: "1px solid #1e293b", pr: 2 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          sx={{ color: "#fbbf24", "&:hover": { background: "rgba(251,191,36,0.1)" } }}
                          onClick={() => openEditModal(item)}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chi tiết">
                        <IconButton
                          size="small"
                          sx={{ color: "#60a5fa", "&:hover": { background: "rgba(96,165,250,0.1)" } }}
                          onClick={() => openViewModal(item)}
                        >
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          sx={{ color: "#f87171", "&:hover": { background: "rgba(248,113,113,0.1)" } }}
                          onClick={() => openDeleteModal(item)}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {pagedItems.length === 0 ? (
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
          count={items.length}
          page={page}
          onPageChange={(_event, nextPage) => setPage(nextPage)}
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

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Tạo banner mới"}
          {modalMode === "edit" && "Chỉnh sửa banner"}
          {modalMode === "view" && "Chi tiết banner"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <div className="grid grid-cols-2 gap-3 rounded-xl p-4 mt-1" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
              {[
                ["ID", activeItem?.banner_id],
                ["Tiêu đề", activeItem?.title],
                ["Tag", activeItem?.tag],
                ["Mô tả", activeItem?.description],
                ["Loại", activeItem?.banner_type],
                ["Button", activeItem?.button],
                ["Link", activeItem?.link_url],
                ["Sort", activeItem?.sort_order],
                ["Active", activeItem?.is_active ? "Có" : "Không"],
              ].map(([label, value]) => (
                <div key={label}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500, wordBreak: "break-word" }}>
                    {String(value || "-")}
                  </Typography>
                </div>
              ))}

              <div className="col-span-2">
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                  Ảnh
                </Typography>
                {activeItem?.image ? (
                  <img
                    src={activeItem.image}
                    alt={activeItem.title || "banner"}
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, marginTop: 8 }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>
                    -
                  </Typography>
                )}
              </div>
            </div>
          )}

          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa banner <strong>#{activeItem?.banner_id} - {activeItem?.title}</strong>?
              </Typography>
            </div>
          )}

          {(modalMode === "create" || modalMode === "edit") && (
            <Stack spacing={2} mt={1}>
              {modalMode === "edit" && (
                <TextField
                  size="small"
                  label="ID"
                  value={form.id}
                  disabled
                  sx={{ ...tfSx, "& .MuiInputBase-root": { color: "#94a3b8", background: "#0f172a" } }}
                />
              )}

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tiêu đề *"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  sx={tfSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Loại banner *"
                  value={form.banner_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, banner_type: e.target.value }))}
                  sx={tfSx}
                >
                  {bannerTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tag"
                  value={form.tag}
                  onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
                  sx={tfSx}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Nút hành động"
                  value={form.button}
                  onChange={(e) => setForm((prev) => ({ ...prev, button: e.target.value }))}
                  sx={tfSx}
                />
              </Stack>

              <TextField
                size="small"
                label="Mô tả"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                sx={tfSx}
                multiline
                minRows={2}
              />

              <TextField
                size="small"
                label="Link URL"
                value={form.link_url}
                onChange={(e) => setForm((prev) => ({ ...prev, link_url: e.target.value }))}
                sx={tfSx}
              />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label="Ảnh banner *"
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  sx={tfSx}
                />
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  disabled={loading}
                  sx={{
                    borderColor: "#334155",
                    color: "#94a3b8",
                    textTransform: "none",
                    minWidth: 130,
                    "&:hover": { borderColor: "#6366f1", color: "#6366f1" },
                  }}
                >
                  Upload ảnh
                  <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                </Button>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                <TextField
                  type="number"
                  size="small"
                  label="Thứ tự"
                  value={form.sort_order}
                  onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                  sx={{ ...tfSx, width: { xs: "100%", md: 180 } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(form.is_active)}
                      onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    />
                  }
                  label={<span style={{ color: "#cbd5e1" }}>Hiển thị</span>}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>
            Đóng
          </Button>
          {modalMode !== "view" && (
            <Button
              onClick={submitModal}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1",
                "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {modalMode === "create" && "Tạo banner"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
