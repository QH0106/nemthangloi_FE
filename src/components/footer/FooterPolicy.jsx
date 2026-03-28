import { Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { footerPolicy } from "./footer.data";
import MuiLink from "@mui/material/Link";
import FooterTitle from "./FooterTitle";

export default function FooterPolicy() {
  return (
    <Stack>
      <FooterTitle title={footerPolicy.title} />

      <Stack spacing={1.2}>
        {footerPolicy.links.map((link, index) => (
          <MuiLink
            key={index}
            component={RouterLink}
            to={link.href}
            underline="none"
            sx={{
              color: "#130505",
              "&:hover": { color: "#9f0a0a" },
            }}
          >
            <Typography fontSize={14}>{link.label}</Typography>
          </MuiLink>
        ))}
      </Stack>
    </Stack>
  );
}
