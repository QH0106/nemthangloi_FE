import { AppBar, Toolbar } from "@mui/material";
import { useState } from "react";

import DesktopNav from "./DesktopNav";
import HeaderIcons from "./HeaderIcons";
import MobileMenuButton from "./MobileMenuButton";
import MobileNav from "./MobileNav";
import { Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: 9999, bgcolor: "bgColor.primary" }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 4 },
            height: { xs: "72px", md: "80px" },
            width: "100%",
            gap: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MuiLink component={Link} to="/">
            <img
              src={"/logo.png"}
              alt={"nem thang loi"}
              className="w-23 h-17.5"
              style={{ cursor: "pointer" }}
            />
          </MuiLink>

          <DesktopNav />

          <HeaderIcons />

          <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
        </Toolbar>
      </AppBar>
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
