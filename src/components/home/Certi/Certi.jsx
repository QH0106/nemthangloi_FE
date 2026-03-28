import { Box, Grid, Typography } from "@mui/material";
import { certiData } from "./certi.data";

export default function Certi() {
    return (
        <Box py={6} bgcolor="#f2f6f4">
          <Typography  display={"flex"} justifyContent={"center"} align="center" fontWeight={600} mb={4} color="black">
            {certiData.title}
          </Typography>
    
          <Grid container spacing={4} justifyContent="center">
            {certiData.items.map((item) => (
              <Grid size = {{xs: 12, md: 3}} key={item.name}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography align="center" fontWeight={500} color="black">
                    {item.name}
                  </Typography>
    
                  <Typography
                    align="center"
                    fontSize={13}
                    color="black"
                  >
                   “{item.quote}”
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }
    
