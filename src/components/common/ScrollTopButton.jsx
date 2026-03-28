import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 12, md: 24 },
        bottom: { xs: 24, md: 32 },
        zIndex: 1400,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: "rgba(0,0,0,0.6)",
          color: "#fff",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          animation: "scrollTopPulse 2s ease-in-out infinite",
          "@keyframes scrollTopPulse": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-3px)" },
          },
        }}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
    </Box>
  );
}

