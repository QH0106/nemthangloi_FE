

import {
  Drawer,
  Box,
  List,
  ListItem,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import NavItem from "./NavItem";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo, useEffect, useState } from "react";
import { makePath } from "../../lib/utils";
import { useCategories } from "../../context/CategoriesContext";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/lib/auth";
import { logoutApi } from "@/api/auth.api";

export default function MobileNav({ open, onClose }) {
  const { navItems } = useCategories();
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
    onClose();
    navigate("/login", { replace: true });
  };

  const navs = useMemo(() => {
    return navItems.map((nav) => ({
      ...nav,
      pattern: makePath(nav.link),
    }));
  }, [navItems]);
  return (
    <Drawer
      transitionDuration={300}
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 1300,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          zIndex: 1301,
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1300,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navs.map((nav) => {
          return (
            <ListItem key={nav.key} sx={{ px: 0, py: 1.5 }}>
              <NavItem item={nav} />
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Button
          component={Link}
          to="/cartPage"
          variant="outlined"
          color="inherit"
          onClick={onClose}
          startIcon={
            <Badge badgeContent={totalCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          }
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          Giỏ hàng
        </Button>

        {isLoggedIn ? (
          <>
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              color="inherit"
              onClick={onClose}
              startIcon={<PersonIcon />}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Tài khoản
            </Button>
            <Button
              variant="contained"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                bgcolor: "#db2777",
                "&:hover": { bgcolor: "#be185d" },
              }}
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              variant="text"
              color="inherit"
              onClick={onClose}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Đăng nhập
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              onClick={onClose}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                bgcolor: "#db2777",
                "&:hover": { bgcolor: "#be185d" },
              }}
            >
              Đăng ký
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
}
