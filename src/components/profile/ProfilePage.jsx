import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { changePasswordApi, getMeApi, logoutApi, updateMeApi } from "@/api/auth.api";
import { clearAuthSession, getRoleFromUser } from "@/lib/auth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const pinkFieldSx = {
    "& .MuiInputLabel-root": { color: "#be185d" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#9d174d" },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(219, 39, 119, 0.35)",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(219, 39, 119, 0.55)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#be185d",
    },
  };

  const hydrateProfileForm = (nextUser) => {
    setProfileForm({
      name: nextUser?.name || "",
      phone: nextUser?.phone || "",
      address: nextUser?.address || "",
      avatar: nextUser?.avatar || "",
    });
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        setError("");

        const me = await getMeApi();
        const nextUser = me?.user ?? me?.data?.user ?? null;

        if (!nextUser) {
          setError("Không lấy được thông tin tài khoản.");
          return;
        }

        setUser(nextUser);
        hydrateProfileForm(nextUser);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
        window.dispatchEvent(new Event("userUpdated"));
      } catch {
        try {
          const localUser = JSON.parse(localStorage.getItem("currentUser") || "null");
          if (localUser) {
            setUser(localUser);
            hydrateProfileForm(localUser);
            setError("Không đồng bộ được thông tin mới từ server, đang hiển thị dữ liệu gần nhất.");
            return;
          }
        } catch {
          // Fall through to the default error.
        }

        setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Clear client auth state even if API call fails.
    }

    clearAuthSession();
    navigate("/login", { replace: true });
  };
  const handleRedirectToAdmin = async () => {
    navigate("/admin", { replace: true });
  };

  const handleProfileChange = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!profileForm.name.trim()) {
      setError("Họ tên không được để trống.");
      return;
    }

    try {
      setSavingProfile(true);
      if (!userId) {
        setError("Không tìm thấy định danh tài khoản để cập nhật.");
        return;
      }

      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        address: profileForm.address.trim(),
        avatar: profileForm.avatar.trim(),
      };

      const res = await updateMeApi(userId, payload);
      const updatedUser = res?.user ?? res?.data?.user ?? { ...user, ...payload };

      setUser(updatedUser);
      hydrateProfileForm(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      setSuccess("Đã cập nhật thông tin tài khoản.");
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể cập nhật thông tin lúc này.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setSavingPassword(true);
      if (!userId) {
        setError("Không tìm thấy định danh tài khoản để đổi mật khẩu.");
        return;
      }

      await changePasswordApi(userId, {
        password: passwordForm.newPassword,
      });

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Đổi mật khẩu thành công.");
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể đổi mật khẩu lúc này.");
    } finally {
      setSavingPassword(false);
    }
  };

  const roleLabel = useMemo(() => {
    const role = getRoleFromUser(user);
    return role === "admin" ? "Quản trị viên" : "Khách hàng";
  }, [user]);

  const userId = useMemo(() => {
    return user?.id ?? user?.user_id ?? null;
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          borderRadius: 4,
          border: "1px solid rgba(219,39,119,0.25)",
          background:
            "linear-gradient(140deg, rgba(255,248,252,0.98) 0%, rgba(254,242,248,0.96) 100%)",
          boxShadow: "0 18px 45px rgba(157,23,77,0.14)",
          p: { xs: 2.2, md: 3 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={user?.avatar || ""}
              sx={{
                width: 58,
                height: 58,
                bgcolor: "#f9a8d4",
                color: "#831843",
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box textAlign="left" >
              <Typography textAlign={"left"} variant="h5" color="#831843" fontWeight={700}>
                Hồ sơ cá nhân
              </Typography>
              <Typography fontSize={14}>
                Quản lý thông tin tài khoản của bạn
              </Typography>
            </Box>
            {user && getRoleFromUser(user) === "admin" ? (
              <Box textAlign="left" >
                <Button
                  onClick={handleRedirectToAdmin}
                  variant="outlined"
                  sx={{
                  borderColor: "rgba(219,39,119,0.5)",
                  color: "#9d174d",
                  bgcolor: "rgba(255, 8, 8,0.28)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#be185d",
                    bgcolor: "rgba(219,39,119,0.08)",
                  },
                }}
              >
                Truy Cập Trang Quản Trị
              </Button>
            </Box>
            ) : null}
          </Stack>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            sx={{
              borderColor: "rgba(219,39,119,0.5)",
              color: "#9d174d",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#be185d",
                bgcolor: "rgba(219,39,119,0.08)",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Stack>

        <Divider sx={{ my: 2.2, borderColor: "rgba(190,24,93,0.2)" }} />

        <Tabs
          value={activeTab}
          onChange={(_e, value) => {
            setActiveTab(value);
            setError("");
            setSuccess("");
          }}
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              color: "#9d174d",
            },
            "& .Mui-selected": {
              color: "#be185d !important",
            },
            "& .MuiTabs-indicator": {
              bgcolor: "#db2777",
            },
          }}
        >
          <Tab value="profile" label="Thông tin tài khoản" />
          <Tab value="settings" label="Account settings" />
        </Tabs>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> : null}

        {loading ? <Typography >Đang tải thông tin tài khoản...</Typography> : null}

        {!loading && activeTab === "profile" ? (
          <Box component="form" onSubmit={handleSaveProfile}>
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Họ tên"
                value={profileForm.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                label="Email"
                value={user?.email || ""}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                label="Số điện thoại"
                value={profileForm.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                label="Địa chỉ"
                value={profileForm.address}
                onChange={(e) => handleProfileChange("address", e.target.value)}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                label="Ảnh đại diện (URL)"
                value={profileForm.avatar}
                onChange={(e) => handleProfileChange("avatar", e.target.value)}
                sx={pinkFieldSx}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Chip
                  label={`Vai trò: ${roleLabel}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(219,39,119,0.12)",
                    color: "#9d174d",
                    fontWeight: 700,
                  }}
                />

                <Button
                  type="submit"
                  disabled={savingProfile}
                  variant="contained"
                  sx={{
                    bgcolor: "#db2777",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#be185d" },
                  }}
                >
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : null}

        {!loading && activeTab === "settings" ? (
          <Box component="form" onSubmit={handleChangePassword}>
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Mật khẩu hiện tại"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                sx={pinkFieldSx}
              />
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Xác nhận mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                sx={pinkFieldSx}
              />

              <Button
                type="submit"
                disabled={savingPassword}
                variant="contained"
                sx={{
                  alignSelf: "flex-end",
                  bgcolor: "#db2777",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#be185d" },
                }}
              >
                {savingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}
