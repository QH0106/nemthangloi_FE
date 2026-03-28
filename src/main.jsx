import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "aos/dist/aos.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import { MuiProvider } from "./context/MuiProvider.jsx";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import BaseLayout from "./components/layouts/BaseLayout.jsx";
import TitleManager from "./components/management/TitleManager.jsx";
import { setupAxiosInterceptors } from "./lib/setupAxiosInterceptors.js";
import axiosClient from "./api/axiosClient.js";
import { useEffect } from "react";
import { clearAuthSession } from "./lib/auth.js";

import "react-inner-image-zoom/lib/styles.min.css";

setupAxiosInterceptors(axiosClient, {
  onUnauthorized: () => {
    const hasSession =
      Boolean(localStorage.getItem("currentUser")) ||
      Boolean(localStorage.getItem("admin_logged_in"));

    if (!hasSession) return;

    const pathname = window.location.pathname;
    const isOnAuthScreen =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname === "/forgotpassword" ||
      pathname === "/admin/login";

    clearAuthSession();

    if (isOnAuthScreen) return;

    const redirectTo = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    window.location.replace(redirectTo);
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};
export default ScrollToTop;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <TitleManager />
      <MuiProvider>
        <CartProvider>
          <ToastContainer
            limit={5}
            theme={"dark"}
            autoClose={2000}
            style={{ top: "100px" }}
          />
          <BaseLayout>
            <App />
          </BaseLayout>
        </CartProvider>
      </MuiProvider>
    </BrowserRouter>
  </StrictMode>
);

