import { Box, Typography, Stack } from "@mui/material";
import MuiLink from "@mui/material/Link";

const DEFAULT_ZALO_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_Zalo.png";
const DEFAULT_FACEBOOK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png";

export default function QuickContactZalo({
  zaloLink = "https://zalo.me",
  zaloLabel = "Chat Zalo",
  zaloIconSrc = DEFAULT_ZALO_LOGO,
  facebookLink = "https://facebook.com",
  facebookLabel = "Facebook",
  facebookIconSrc = DEFAULT_FACEBOOK_LOGO,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 12, md: 24 },
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1400,
      }}
    >
      <Stack spacing={1.5}>
        {/* Zalo */}
        <MuiLink
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#0084ff",
            color: "#fff",
            borderRadius: 999,
            px: 2,
            py: 1,
            boxShadow: "0 6px 18px rgba(0, 132, 255, 0.45)",
            cursor: "pointer",
            transformOrigin: "center",
            animation: "zaloFloat 2.4s ease-in-out infinite",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 132, 255, 0.6)",
              transform: "translateY(-2px)",
            },
            "@keyframes zaloFloat": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-4px)" },
            },
          }}
        >
          <Box
            component="img"
            src={zaloIconSrc}
            alt="Zalo"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#fff",
              objectFit: "cover",
            }}
          />
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {zaloLabel}
          </Typography>
        </MuiLink>

        {/* Facebook */}
        <MuiLink
          href={facebookLink}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#1877f2",
            color: "#fff",
            borderRadius: 999,
            px: 2,
            py: 1,
            boxShadow: "0 6px 18px rgba(24, 119, 242, 0.45)",
            cursor: "pointer",
            transformOrigin: "center",
            animation: "fbFloat 2.4s ease-in-out infinite",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(24, 119, 242, 0.6)",
              transform: "translateY(-2px)",
            },
            "@keyframes fbFloat": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-4px)" },
            },
          }}
        >
          <Box
            component="img"
            src={facebookIconSrc}
            alt="Facebook"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#fff",
              objectFit: "cover",
            }}
          />
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {facebookLabel}
          </Typography>
        </MuiLink>
      </Stack>
    </Box>
  );
}


