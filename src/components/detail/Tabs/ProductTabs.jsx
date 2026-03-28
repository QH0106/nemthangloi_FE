import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function ProductTabs({ description }) {
  const [tab, setTab] = useState(0);
  return (
    <Box mt={6}>
      <Tabs
        value={tab}
        centered
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: "none",
          ".MuiTabs-indicator": {
            height: 3,
          },

          justifyContent: "center",
          ".MuiTab-root": {
            color: "rgba(0,0,0,0.8)",
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
            fontSize: "1.1rem",
          },
          ".MuiTab-root.Mui-selected": {
            color: "primary.main",
            fontWeight: 600,
            fontSize: "1.1rem",
          },
        }}
      >
        <Tab label="Mô tả sản phẩm" />
        <Tab label="Vận Chuyển - Đổi Trả" />
      </Tabs>

      <Box p={3}>
        {tab === 0 && (
          <Typography color="#000000" sx={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}>
            {description}
          </Typography>
        )}
        {tab === 1 && (
          <Typography color="#000000">
            Giao hàng toàn quốc - đổi trả trong 7 ngày
          </Typography>
        )}
      </Box>
    </Box>
  );
}
