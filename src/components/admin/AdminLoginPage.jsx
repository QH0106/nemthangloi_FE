import { useState } from "react";
import { Alert, Button, InputAdornment, TextField, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { adminLoginApi } from "@/api/admin.api";
import { extractUserFromResponse, getRoleFromUser, saveAuthSession } from "@/lib/auth";

const tfSx = {
  "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  "& .MuiSvgIcon-root": { color: "#475569" },
};

export default function AdminLoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || "/admin";

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!emailOrPhone || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const res = await adminLoginApi({ emailOrPhone, password });
      if ((res?.statusCode || 0) >= 400) {
        setError(res?.message || "Đăng nhập thất bại.");
        return;
      }

      const user = extractUserFromResponse(res);
      const role = getRoleFromUser(user);

      if (!user || role !== "admin") {
        setError("Tài khoản này không có quyền quản trị.");
        return;
      }

      saveAuthSession(user);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#0b0f19" }}
    >
      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{ background: "#111827", border: "1px solid #1e293b", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-indigo-900/50"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
              <AdminPanelSettingsIcon sx={{ color: "#fff", fontSize: 28 }} />
            </div>
            <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Đăng nhập để truy cập khu vực quản trị
            </Typography>
          </div>

          {error ? (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, "& .MuiAlert-message": { color: "#fca5a5" }, background: "rgba(127,29,29,0.4)", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error}
            </Alert>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <TextField
              label="Email hoặc số điện thoại"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              fullWidth
              size="small"
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={tfSx}
            />
            <TextField
              label="Mật khẩu"
              className="mt-5!"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              size="small"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={tfSx}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.2,
                bgcolor: "#6366f1",
                "&:hover": { bgcolor: "#4f46e5" },
                textTransform: "none",
                fontWeight: 600,
                fontSize: "15px",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
              }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>

        <Typography variant="caption" align="center" display="block" sx={{ mt: 3, color: "#334155" }}>
          NemThangLoi Admin Panel © {new Date().getFullYear()}
        </Typography>
      </div>
    </div>
  );
}

