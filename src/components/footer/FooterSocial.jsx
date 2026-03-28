import { Stack, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";



export default function IconSocial() {
  const socials = [
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: <FacebookIcon />,
    },
    {
      name: "YouTube",
      url: "https://youtube.com",
      icon: <YouTubeIcon />,
    },
    {
      name: "TikTok",
      url: "https://tiktok.com",
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
          alt="TikTok"
          width={22}
          height={22}
        />
      ),
    },
    {
      name: "Zalo",
      url: "https://zalo.me",
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt="Zalo"
          width={22}
          height={22}
        />
      ),
    },
  ];

  return (
    <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
      {socials.map((item) => (
        <IconButton
          key={item.name}
          component="a"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid #120a0a",
            bgcolor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              color: "#1976d2",
              transform: "scale(1.1)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          {item.icon}
        </IconButton>
      ))}
    </Stack>
  );
}
