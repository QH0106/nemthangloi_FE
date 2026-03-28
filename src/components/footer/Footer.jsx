import { Box, Grid, Divider } from "@mui/material";
import {
  FooterAbout,
  FooterPolicy,
  FooterNewsletter,
  FooterSocial,
} from "./";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "left",
        bgcolor: "#f5f5f5",
        pt: 6,
        pb: 4,
      }}
    >
      <Box px={{ xs: 2, md: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FooterAbout />
          </Grid>

          <Grid item xs={12} md={4}>
            <FooterPolicy />
          </Grid>

          <Grid item xs={12} md={4}>
            <FooterNewsletter />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <FooterSocial />
      </Box>
    </Box>
  );
}
