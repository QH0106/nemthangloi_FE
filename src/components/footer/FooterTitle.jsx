import { Typography } from "@mui/material";

export default function FooterTitle({ title, color = "#d32f2f" }) {
  return (
    <Typography
      fontWeight={700}
      textTransform="uppercase"
      mb={2}
      sx={{
        color: color,
        position: "relative",
        display: "inline-block",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -6,
          left: 0,
          width: 40,
          height: 3,
          backgroundColor: "#d32f2f",
        },
      }}
    >
      {title}
    </Typography>
  );
}
