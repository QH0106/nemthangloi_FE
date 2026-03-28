import { useState } from "react";
import { Avatar, Chip, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { logoutApi } from "@/api/auth.api";
import { clearAuthSession } from "@/lib/auth";

const navItems = [
  { to: "/admin", label: "Tổng quan", end: true, icon: <DashboardIcon fontSize="small" /> },
  { to: "/admin/products", label: "Sản phẩm", icon: <InventoryIcon fontSize="small" /> },
  { to: "/admin/categories", label: "Danh mục", icon: <CategoryIcon fontSize="small" /> },
  { to: "/admin/variants", label: "Biến thể", icon: <TuneIcon fontSize="small" /> },
  { to: "/admin/images", label: "Hình ảnh", icon: <ImageIcon fontSize="small" /> },
  { to: "/admin/promotions", label: "Khuyến mãi", icon: <LocalOfferIcon fontSize="small" /> },
  { to: "/admin/banners", label: "Banners", icon: <ViewCarouselIcon fontSize="small" /> },
  { to: "/admin/orders", label: "Đơn hàng", icon: <ShoppingCartIcon fontSize="small" /> },
  { to: "/admin/users", label: "Người dùng", icon: <PeopleIcon fontSize="small" /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Clear client state even if API logout fails.
    }

    clearAuthSession();
    navigate("/admin/login", { replace: true });
  };

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin_user") || "null");
    } catch {
      return null;
    }
  })();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40">
          <AdminPanelSettingsIcon style={{ fontSize: 20, color: "#fff" }} />
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#f1f5f9", lineHeight: 1.2 }}>
            NemThangLoi
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Admin Panel
          </Typography>
        </div>
      </div>

      <Divider sx={{ borderColor: "#1e293b" }} />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-white" : "text-slate-500"}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Divider sx={{ borderColor: "#1e293b" }} />

      {/* User info + logout */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar
          sx={{ width: 34, height: 34, bgcolor: "#334155", fontSize: 14, fontWeight: 700 }}
        >
          {adminUser?.email?.[0]?.toUpperCase() || "A"}
        </Avatar>
        <div className="min-w-0 flex-1">
          <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontWeight: 600 }}>
            {adminUser?.email || "Admin"}
          </Typography>
          <Chip
            label="Administrator"
            size="small"
            sx={{
              height: 16,
              fontSize: "10px",
              bgcolor: "#1e3a5f",
              color: "#60a5fa",
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        </div>
        <Tooltip title="Đăng xuất">
          <IconButton size="small" onClick={logout} sx={{ color: "#475569", "&:hover": { color: "#f87171" } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#0b0f19" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: "#0f1624", borderColor: "#1e293b" }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header
          className="flex items-center gap-3 border-b px-4 py-3 lg:hidden"
          style={{ background: "#0f1624", borderColor: "#1e293b" }}
        >
          <IconButton size="small" onClick={() => setSidebarOpen(true)} sx={{ color: "#94a3b8" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#f1f5f9" }}>
            NemThangLoi Admin
          </Typography>
          {sidebarOpen && (
            <IconButton size="small" onClick={() => setSidebarOpen(false)} sx={{ ml: "auto", color: "#94a3b8" }}>
              <CloseIcon />
            </IconButton>
          )}
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
