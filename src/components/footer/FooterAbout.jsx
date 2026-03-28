import { Stack, Typography, Divider } from "@mui/material";
import { footerAbout, footerPayment } from "./footer.data";
import FooterTitle from "./FooterTitle";

export default function FooterAbout() {
  return (
    <Stack>
      <Stack spacing={2}>
        <FooterTitle title={footerAbout.title} />

        <Typography fontWeight={700} color="black">
          {footerAbout.companyName}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {footerAbout.items.map((item, idx) => (
          <Typography
            key={idx}
            fontSize={14}
            color={item.highlight ? "error.main" : "black"}
            fontWeight={item.strong ? 600 : 400}
          >
            {item.label}
          </Typography>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography fontWeight={700} mb={1} color="black">
        {footerPayment.title}
      </Typography>

      <Stack spacing={1}>
        {footerPayment.items.map((item, idx) => (
          <Typography
            key={idx}
            fontSize={14}
            fontWeight={item.strong ? 600 : 400}
            color="black"
          >
            {item.label}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
