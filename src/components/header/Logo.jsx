import { Typography } from "@mui/material";

export default function Logo() {
  return (
    <Typography
      variant="title-large"
      href="/"
      component="a"
      sx={{ flexGrow: 1, fontWeight: 600, color: "black" }}
    >
      Logo
    </Typography>
  );
}
