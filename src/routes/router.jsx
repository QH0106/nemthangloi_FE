import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container, Typography } from "@mui/material";

import ProductsPage from "../components/products/ProductsPage";
import CartPage from "../components/cart/CartPage";
import ErrorBoundary from "./ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
import { isAdminAuthed, isUserAuthed } from "./isAuthed";

function Loading() {
  return <div style={{ padding: 24 }}>Loading...</div>;
}

function CommingSoonPage({ title }) {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Typography sx={{ mt: 1 }} color="text.primary">
        Trang này đang được hoàn thiện.
      </Typography>
    </Container>
  );
}

function NotFoundPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={800} color="text.primary">
        404
      </Typography>
      <Typography sx={{ mt: 1 }} color="text.primary">
        Không tìm thấy trang.
      </Typography>
    </Container>
  );
}

const HomePage = React.lazy(() => import("../components/home/HomePage"));
const IntroducePage = React.lazy(() => import("../components/introduce/IntroducePage"));
const ProductDetail = React.lazy(
  () => import("../components/detail/ProductDetail"),
);
const LoginPage = React.lazy(() => import("@/components/login/Login"));
const ProfilePage = React.lazy(() => import("@/components/profile/ProfilePage"));
const ForgotPasswordPage = React.lazy(() => import("@/components/forgot-password/ForgotPassword"));
const AdminLoginPage = React.lazy(() => import("@/components/admin/AdminLoginPage"));
const RegisterPage = React.lazy(() => import("@/components/register/Register"));
const AdminLayout = React.lazy(() => import("@/components/admin/AdminLayout"));
const AdminDashboardHome = React.lazy(() => import("@/components/admin/pages/AdminDashboardHome"));
const AdminProductsPage = React.lazy(() => import("@/components/admin/pages/AdminProductsPage"));
const AdminCategoriesPage = React.lazy(() => import("@/components/admin/pages/AdminCategoriesPage"));
const AdminVariantsPage = React.lazy(() => import("@/components/admin/pages/AdminVariantsPage"));
const AdminImagesPage = React.lazy(() => import("@/components/admin/pages/AdminImagesPage"));
const AdminPromotionsPage = React.lazy(() => import("@/components/admin/pages/AdminPromotionsPage"));
const AdminBannersPage = React.lazy(() => import("@/components/admin/pages/AdminBannersPage"));
const AdminOrdersPage = React.lazy(() => import("@/components/admin/pages/AdminOrdersPage"));
const AdminUsersPage = React.lazy(() => import("@/components/admin/pages/AdminUsersPage"));
const HowToOrderPage = React.lazy(
  () => import("@/components/how-to-order/HowToOrderPage"),
);

export default function AppRouter() {

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          <Route
            path="/gioi-thieu"
            element={<IntroducePage />}
          />
          <Route
            path="/huong-dan-dat-hang"
            element={<HowToOrderPage />}
          />
          <Route
            path="/kinh-nghiem"
            element={<CommingSoonPage title="Kinh nghiệm" />}
          />
          <Route
            path="/lien-he"
            element={<CommingSoonPage title="Liên hệ" />}
          />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductsPage />} />
          {/* {categorySlugs.map((p) => (
            <Route key={p} path={`/${p}`} element={<ProductsPage />} />
          ))} */}

          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cartPage" element={<CartPage />} />

          {/* User auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute validateFn={isUserAuthed} redirectTo="/login" />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin protected */}
          <Route
            element={
              <PrivateRoute validateFn={isAdminAuthed} redirectTo="/admin/login" />
            }
          >
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="variants" element={<AdminVariantsPage />} />
              <Route path="images" element={<AdminImagesPage />} />
              <Route path="promotions" element={<AdminPromotionsPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          {/* Not found */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}
