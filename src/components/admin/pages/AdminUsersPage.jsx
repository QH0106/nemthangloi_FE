import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
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
import SearchIcon from "@mui/icons-material/Search";
import {
  createUserAdminApi,
  deleteUserAdminApi,
  listUsersAdminApi,
  updateUserAdminApi,
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

const createInitialForm = () => ({
  id: "",
  email: "",
  password: "",
  name: "",
  phone: "",
  address: "",
  avatar: "",
});

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(createInitialForm());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeItem, setActiveItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [totalRows, setTotalRows] = useState(0);

  const notify = (type, text) => setMessage({ type, text });

  const load = async () => {
    try {
      setLoading(true);
      const data = await listUsersAdminApi({ page: page + 1, limit: rowsPerPage, search });
      setItems(Array.isArray(data?.users) ? data.users : []);
      setTotalRows(Number(data?.pagination?.total || 0));
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, rowsPerPage, search]);

  const onCreate = async () => {
    if (!form.email || !form.password) return notify("error", "Email và password là bắt buộc.");
    try {
      setLoading(true);
      await createUserAdminApi({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        avatar: form.avatar || undefined,
      });
      setForm(createInitialForm());
      await load();
      notify("success", "Tạo user thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Tạo user thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return notify("error", "Thiếu ID user.");
    try {
      setLoading(true);
      await updateUserAdminApi(Number(form.id), {
        email: form.email || undefined,
        password: form.password || undefined,
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        avatar: form.avatar || undefined,
      });
      await load();
      notify("success", "Cập nhật user thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Cập nhật user thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deleteUserAdminApi(id);
      const nextPage = page > 0 && items.length === 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) {
        await load();
      }
      notify("success", "Đã xóa user.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa user thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm(createInitialForm());
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
      id: String(item.id || ""),
      email: item.email || "",
      password: "",
      name: item.name || "",
      phone: item.phone || "",
      address: item.address || "",
      avatar: item.avatar || "",
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
    if (modalMode === "delete" && activeItem?.id) {
      await onDelete(activeItem.id);
      setModalOpen(false);
    }
  };

  const onSearch = () => {
    setPage(0);
    setSearch(searchInput.trim());
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>Quản lý Người dùng</Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>{totalRows} người dùng</Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            disabled={loading}
            size="small"
            sx={{ borderColor: "#334155", color: "#94a3b8", "&:hover": { borderColor: "#6366f1", color: "#6366f1" }, textTransform: "none" }}
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
            Thêm mới
          </Button>
        </Stack>
      </div>

      {message.text ? <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>{message.text}</Alert> : null}

      <div className="rounded-2xl p-3 flex justify-between" style={{ background: "#111827", border: "1px solid #1e293b" }}>
         <div className="px-5 py-1 ">
          <Typography className="items-center pt-1" variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 600 }}>Danh sách người dùng</Typography>
        </div>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
          <TextField
            size="small"
            placeholder="Tìm Kiếm Email / Tên / SĐT"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            sx={{ ...tfSx, minWidth: 280 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onSearch}
            disabled={loading}
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none", fontWeight: 600 }}
          >
            Tìm
          </Button>
        </Stack>
      </div>

      <div style={S.card}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Người dùng</TableCell>
                <TableCell sx={S.theadCell}>SĐT</TableCell>
                <TableCell sx={S.theadCell}>Địa chỉ</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} sx={{ "&:hover": { background: "#1e293b" } }}>
                  <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.id}</TableCell>
                  <TableCell sx={S.bodyCell}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar src={item.avatar || undefined} sx={{ width: 28, height: 28, bgcolor: "#334155", fontSize: 12 }}>
                        {item?.email?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                      <div>
                        <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{item.name || "—"}</Typography>
                        <Typography variant="caption" sx={{ color: "#60a5fa" }}>{item.email || "—"}</Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell sx={S.bodyCell}>{item.phone || "—"}</TableCell>
                  <TableCell sx={{ ...S.bodyCell, maxWidth: 240 }}>
                    <Typography variant="body2" sx={{ color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.address || "—"}
                    </Typography>
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

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Tạo người dùng"}
          {modalMode === "edit" && "Chỉnh sửa người dùng"}
          {modalMode === "view" && "Chi tiết người dùng"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <Stack spacing={2} mt={1}>
              <div className="grid grid-cols-2 gap-3 rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                {[["ID", activeItem?.id], ["Email", activeItem?.email], ["Tên", activeItem?.name], ["SĐT", activeItem?.phone]].map(([label, value]) => (
                  <div key={label}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value || "—"}</Typography>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>Địa chỉ</Typography>
                <Typography variant="body2" sx={{ color: "#f1f5f9", mt: 0.5 }}>{activeItem?.address || "—"}</Typography>
              </div>
            </Stack>
          )}
          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa user <strong>#{activeItem?.id} - {activeItem?.email}</strong>?
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
              <TextField size="small" label="Email *" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} sx={tfSx} />
              <TextField
                size="small"
                label={modalMode === "create" ? "Password *" : "Password mới (để trống nếu không đổi)"}
                type="password"
                value={form.password}
                onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
                sx={tfSx}
              />
              <TextField size="small" label="Tên" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} sx={tfSx} />
              <TextField size="small" label="Số điện thoại" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} sx={tfSx} />
              <TextField size="small" label="Avatar URL" value={form.avatar} onChange={(e) => setForm((v) => ({ ...v, avatar: e.target.value }))} sx={tfSx} />
              <TextField size="small" label="Địa chỉ" value={form.address} onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))} sx={tfSx} multiline minRows={2} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>Đóng</Button>
          {modalMode !== "view" && (
            <Button
              onClick={submitModal}
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1", "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" }, textTransform: "none", fontWeight: 600 }}
            >
              {modalMode === "create" && "Tạo User"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
