import { useEffect, useState } from "react";
import { Alert, CircularProgress, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import TuneIcon from "@mui/icons-material/Tune";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import {
  listCategoriesAdminApi,
  listImagesAdminApi,
  listProductsAdminApi,
  listPromotionsAdminApi,
  listUsersAdminApi,
  listVariantsAdminApi,
} from "@/api/admin.api";

const statCards = [
  {
    key: "products",
    label: "Sản phẩm",
    icon: <InventoryIcon />,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
  },
  {
    key: "categories",
    label: "Danh mục",
    icon: <CategoryIcon />,
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.10)",
  },
  {
    key: "variants",
    label: "Biến thể",
    icon: <TuneIcon />,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  {
    key: "images",
    label: "Hình ảnh",
    icon: <ImageIcon />,
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
  },
  {
    key: "promotions",
    label: "Khuyến mãi",
    icon: <LocalOfferIcon />,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.10)",
  },
  {
    key: "users",
    label: "Người dùng",
    icon: <PeopleIcon />,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
];

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    variants: 0,
    images: 0,
    promotions: 0,
    users: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      listProductsAdminApi({ page: 1, limit: 100 }),
      listCategoriesAdminApi({ page: 1, limit: 1 }),
      listVariantsAdminApi({ page: 1, limit: 1 }),
      listImagesAdminApi({ page: 1, limit: 1 }),
      listPromotionsAdminApi({ page: 1, limit: 1 }),
      listUsersAdminApi({ page: 1, limit: 1 }),
    ])
      .then(([productsRes, categories, variants, images, promotions, usersRes]) => {
        setStats({
          products: productsRes?.products?.length || 0,
          categories: Number(categories?.pagination?.total || 0),
          variants: Number(variants?.pagination?.total || 0),
          images: Number(images?.pagination?.total || 0),
          promotions: Number(promotions?.pagination?.total || 0),
          users: Number(usersRes?.pagination?.total || 0),
        });
      })
      .catch((err) => setError(err?.response?.data?.message || "Không thể tải thống kê."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>
          Tổng quan
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Chào mừng trở lại. Đây là tóm tắt hệ thống của bạn.
        </Typography>
      </div>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "#131929", borderColor: "#1e293b" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: card.bg, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            {loading ? (
              <CircularProgress size={20} sx={{ color: card.color }} />
            ) : (
              <Typography variant="h4" fontWeight={700} sx={{ color: "#f1f5f9", lineHeight: 1 }}>
                {stats[card.key]}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
              {card.label}
            </Typography>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#94a3b8", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "11px" }}>
          Quản lý nhanh
        </Typography>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: "Thêm sản phẩm", href: "/admin/products", color: "#6366f1" },
            { label: "Thêm danh mục", href: "/admin/categories", color: "#22d3ee" },
            { label: "Thêm biến thể", href: "/admin/variants", color: "#a78bfa" },
            { label: "Thêm khuyến mãi", href: "/admin/promotions", color: "#fb923c" },
            { label: "Quản lý người dùng", href: "/admin/users", color: "#60a5fa" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-150 hover:border-transparent"
              style={{
                background: "#131929",
                borderColor: "#1e293b",
                color: link.color,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = link.color + "18";
                e.currentTarget.style.borderColor = link.color + "40";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#131929";
                e.currentTarget.style.borderColor = "#1e293b";
              }}
            >
              + {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
