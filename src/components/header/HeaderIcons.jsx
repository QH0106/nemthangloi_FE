import { Box, IconButton, Badge, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearAuthSession } from "@/lib/auth";
import { logoutApi } from "@/api/auth.api";

export default function HeaderIcons() {
  const { totalCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "null");
        setIsLoggedIn(Boolean(user));
      } catch {
        setIsLoggedIn(false);
      }
    };

    syncAuth();
    window.addEventListener("userUpdated", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("userUpdated", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Always clear client auth state, even if API logout fails.
    }

    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        gap: 2,
        ml: 3,
      }}
    >
      <IconButton sx={{ color: "black" }}>
        <SearchIcon />
      </IconButton>
      <IconButton
        component={Link}
        to="/cartPage"
        sx={{ color: "black" }}
        aria-label="Giỏ hàng"
      >
        <Badge badgeContent={totalCount} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {isLoggedIn ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component={Link} to="/profile" sx={{ color: "black" }} aria-label="Tài khoản">
            <PersonIcon />
          </IconButton>
          <IconButton onClick={handleLogout} sx={{ color: "black" }} aria-label="Đăng xuất">
            <LogoutIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            component={Link}
            to="/login"
            size="small"
            variant="text"
            sx={{ color: "#9d174d", fontWeight: 600, textTransform: "none" }}
          >
            Đăng nhập
          </Button>
          <Button
            component={Link}
            to="/register"
            size="small"
            variant="contained"
            sx={{
              bgcolor: "#db2777",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#be185d" },
            }}
          >
            Đăng ký
          </Button>
        </Box>
      )}
    </Box>
  );
}
