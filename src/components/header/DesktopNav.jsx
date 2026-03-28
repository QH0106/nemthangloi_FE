import { Box } from "@mui/material";
import NavItem from "./NavItem";
import { useMemo } from "react";
import { makePath } from "../../lib/utils";
import { useCategories } from "../../context/CategoriesContext";

export default function DesktopNav() {
  const { navItems } = useCategories();
  const navs = useMemo(() => {
    return navItems.map((nav) => ({
      ...nav,
      pattern: makePath(nav.link),
    }));
  }, [navItems]);

  return (
    <Box
      sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 3 }}
    >
      {navs.map((nav) => {
        return <NavItem key={nav.key} item={nav} />;
      })}
    </Box>
  );
}
