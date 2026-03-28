import { useState } from "react";
import { toast } from "react-toastify";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { loginApi } from "@/api/auth.api";
import { addToCartApi } from "@/api/cart.api";
import { Link, useNavigate } from "react-router-dom";
import { extractUserFromResponse, getRoleFromUser, saveAuthSession } from "@/lib/auth";
import { getGuestCartId, getSessionCart, setSessionCart } from "@/components/cart/AddToCart";
import { GUEST_ORDER_ID_KEY } from "@/context/CartContext";

const mergeCartItemsByVariant = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    const key = String(item?.product_variant_id);
    if (!key || key === "undefined" || key === "null") return;

    if (!map.has(key)) {
      map.set(key, {
        product_variant_id: Number(item.product_variant_id),
        quantity: Number(item.quantity) || 0,
      });
      return;
    }

    const current = map.get(key);
    current.quantity += Number(item.quantity) || 0;
    map.set(key, current);
  });

  return Array.from(map.values()).filter(
    (item) => Number(item.product_variant_id) > 0 && item.quantity > 0,
  );
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!emailOrPhone.trim() || !password) {
      setError("Vui lòng nhập email/số điện thoại và mật khẩu");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginApi({
        emailOrPhone: emailOrPhone.trim(),
        password,
      });

      const user = extractUserFromResponse(res);
      if (user) {
        saveAuthSession(user);

        // Merge guest/local cart into authenticated cart so items persist across sessions/devices.
        try {
          const localCart = getSessionCart();
          const mergedItems = mergeCartItemsByVariant(localCart);
          const userId = Number(user?.user_id ?? user?.id ?? 0);

          if (userId > 0 && mergedItems.length > 0) {
            const cartRes = await addToCartApi({
              user_id: userId,
              guest_cart_id: getGuestCartId(),
              items: mergedItems,
            }, {
              _skipAuthLogout: true,
            });

            const syncedOrderId =
              cartRes?.order_id ??
              cartRes?.cart?.order_id ??
              null;
            if (syncedOrderId) {
              try {
                const currentUser = JSON.parse(
                  localStorage.getItem("currentUser") || "null",
                );
                if (currentUser) {
                  localStorage.setItem(
                    "currentUser",
                    JSON.stringify({ ...currentUser, order_id: syncedOrderId }),
                  );
                  window.dispatchEvent(new Event("userUpdated"));
                }
              } catch {
                // ignore
              }
            }

            setSessionCart([]);
            try {
              localStorage.removeItem(GUEST_ORDER_ID_KEY);
            } catch {
              // ignore
            }
            window.dispatchEvent(new Event("cartUpdated"));
          }
        } catch (syncError) {
          console.error("[Login] Sync local cart to user cart failed:", syncError);
        }

        const role = getRoleFromUser(user);
        toast.success("Đăng nhập thành công!");
        navigate(role === "admin" ? "/admin" : "/");
        return;
      }

      setError("Thông tin đăng nhập chưa đúng");
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 940,
        mx: "auto",
        my: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          border: "1px solid rgba(219, 39, 119, 0.25)",
          background:
            "linear-gradient(135deg, rgba(255, 248, 252, 0.96) 0%, rgba(254, 242, 248, 0.92) 100%)",
          boxShadow: "0 20px 55px rgba(157, 23, 77, 0.15)",
          overflow: "hidden",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              p: { xs: 3, md: 4 },
              color: "#f8fafc",
              background:
                "radial-gradient(circle at 20% 20%, #f9a8d4 0%, #ec4899 52%, #9d174d 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography fontSize={13} sx={{ opacity: 0.85, letterSpacing: 1.1, textTransform: "uppercase"}}>
                Nệm Thắng Lợi
              </Typography>
              <br />
              <Typography fontSize={{ xs: 26, md: 30 }} fontWeight={700} lineHeight={1.2} mt={1}>
                Chào mừng bạn quay trở lại
              </Typography>
              <br />
              <Typography fontSize={14} sx={{ opacity: 0.9, mt: 1.5 }}>
                Đăng nhập để theo dõi đơn hàng, quản lý thông tin và nhận ưu đãi cá nhân hóa.
              </Typography>
            </Box>

            <Typography fontSize={13} sx={{ opacity: 0.8 }}>
              Mọi dữ liệu đều được bảo vệ an toàn trong hệ thống.
            </Typography>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "60%" }, p: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#831843">
                Đăng nhập tài khoản
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  size="small"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  label="Email hoặc số điện thoại"
                  sx={pinkFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ fontSize: 19, color: "#be185d" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  sx={pinkFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography
                    component={Link}
                    to="/forgot-password"
                    sx={{ color: "#9d174d", fontSize: 13, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                  >
                    Quên mật khẩu?
                  </Typography>
                </Box>

                {error ? (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "#db2777",
                    color: "#fff",
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    "&:hover": { bgcolor: "#be185d" },
                  }}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              rowGap={1}
            >
              <Typography fontSize={14} >
                Chưa có tài khoản?
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  borderColor: "#db2777",
                  color: "#9d174d",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#be185d",
                    bgcolor: "rgba(219, 39, 119, 0.08)",
                  },
                }}
              >
                Tạo tài khoản
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
