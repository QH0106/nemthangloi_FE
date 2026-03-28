import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";



export default function MobileMenuButton({ onClick }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{ display: { xs: "block", lg: "none" }, color: "black" }}
    >
      <MenuIcon />
    </IconButton>
  );
}
