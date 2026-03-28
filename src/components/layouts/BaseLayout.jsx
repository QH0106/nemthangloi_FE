import { Box, Stack, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { CategoriesProvider } from "../../context/CategoriesContext";
import { useLocation } from "react-router-dom";
import QuickContactZalo from "../common/QuickContactZalo";
import ScrollTopButton from "../common/ScrollTopButton";

const BaseLayout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (!rootElement) return;

    rootElement.classList.remove("root-user", "root-admin");
    rootElement.classList.add(isAdminRoute ? "root-admin" : "root-user");
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <CategoriesProvider>{children}</CategoriesProvider>;
  }

  return (
    <CategoriesProvider>
    <Box
      className="bg-grid"
      minHeight={"100dvh"}
      pt={{ xs: "52px", md: "60px" }}
      sx={{ background: theme.palette.bgColor.primary }}
    >
      <Stack
        component={"main"}
        width={"100%"}
        height={"100%"}
        position={"relative"}
        zIndex={1}
        py={6}
      >
        <Header />
        {/* <ProductBanner /> */}
        {children}
      </Stack>
      <Footer />
      <QuickContactZalo />
      <ScrollTopButton />
    </Box>
    </CategoriesProvider>
  );
};

export default BaseLayout;
