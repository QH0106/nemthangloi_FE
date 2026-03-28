import { Grid, Typography, Box } from "@mui/material";
import { service } from "./Service.data";

export default function Service() {
  return (
    <Grid container spacing={2}>
      {service.map((item) => (
        <Grid size = {{xs: 6, md:3}} key={item.label}>
          <Box 
            textAlign="center"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <img src={item.icon} alt={item.label} style={{ margin: "0 auto" }} />
            <Typography fontWeight={600} color="black">
              {item.label}
            </Typography>
            <Typography fontSize={13} color="black">
              {item.desc}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
