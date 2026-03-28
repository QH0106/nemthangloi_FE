import { makePath, matchPath } from "../../lib/utils";
import { Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import NavDropdown from "./NavDropdown";

export default function NavItem({ item }) {
  const pathName = useLocation().pathname;
   const isActive = item.children
    ? !!item.children.find(elm => matchPath(pathName, makePath(elm.link)))
    : matchPath(pathName, item.pattern);

    if (item.children) {
    return <NavDropdown key={item.key} data={item} isActive={isActive} />;
  }

  return (
    <Box
      component={RouterLink}
      to={item.link}
      sx={{
        position: "relative",
        fontWeight: 700,
        textTransform: "uppercase",
        color: "text.primary",
        textDecoration: "none",
        cursor: "pointer",
        display: "inline-block",
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "1.5px",
          bgcolor: "text.primary",
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "right",
          transition: "transform 0.35s ease",
        },
        "&:hover": {
          color: "text.primary",
        },
        "&:hover::after": {
          transform: "scaleX(1)",
          transformOrigin: "left",
        },
      }}
    >
      {item.title}
    </Box>
  );
}
