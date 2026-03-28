

import { Menu, MenuItem, Typography, Box } from "@mui/material";
import { useState } from "react";
import Arrow from "../../assets/arrow";

import { Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";

const NavDropdown = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToggle = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItem = (item) => (
    <MuiLink component={Link} to={item.link} key={item.key} underline="none">
      <MenuItem
        sx={{
          padding: "12px",
          "&:hover": { color: "dark.500" },
        }}
        onClick={handleClose}
      >
        <Typography
          variant="body-xs"
          fontSize="14px"
          fontWeight={700}
          color="text.primary"
          sx={{ textTransform: "uppercase" }}
        >
          {item.title}
        </Typography>
      </MenuItem>
    </MuiLink>
  );

  return (
    <Box
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      sx={{ position: "relative" }}
    >
      {/* Trigger */}
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "1.5px",
            bgcolor: "#FFFFFF",
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.35s ease",
          },
          "&:hover::after": {
            transform: "scaleX(1)",
            transformOrigin: "left",
          },
        }}
      >
        <Typography
          sx={{
            color: "text.primary",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {data.title}
        </Typography>

        <Arrow open={open} />
      </Box>

      {/* Dropdown */}
      <Menu
        id={"header-nav-dropdown-" + data.key}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: { pointerEvents: "none" },
          },
        }}
        disablePortal
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          pointerEvents: "none",
          "& .MuiPaper-root": {
            bgcolor: "light.50",
            color: "dark.400",
            mt: 1,
            pointerEvents: "auto",
          },
          "& .MuiList-root": {
            padding: 0,
            minWidth: "200px",
          },
        }}
      >
        {data.children?.map(renderMenuItem)}
      </Menu>
    </Box>
  );
};

export default NavDropdown;
