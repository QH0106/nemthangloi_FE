import { Box, Grid, Typography, Button } from "@mui/material";
import { Banners } from "./Banners.data";
import { useEffect, useMemo, useState } from "react";
import { getBannersApi } from "@/api/banner.api";



export default function PromoBanners() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      const banners = await getBannersApi({ banner_type: "promo" });
      if (!mounted) return;

      setItems(Array.isArray(banners) ? banners : []);
    };

    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  const displayBanners = useMemo(() => {
    if (items.length > 0) {
      return items.map((banner) => ({
        id: banner?.banner_id ?? banner?.id,
        tag: banner?.tag,
        title: banner?.title,
        description: banner?.description,
        image: banner?.image,
        button: banner?.button,
        linkUrl: banner?.link_url,
      }));
    }

    return Banners;
  }, [items]);

  return (
    <Grid container spacing={2}>
      {displayBanners.map((item, index) => (
        <Grid
          size={{ xs: 12, md: 6 }}
          key={item.id || index}
          data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
          data-aos-delay={index * 300}
        >
          <Box
            sx={{
              height: 280,
              p: 4,
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {item.tag && (
              <Typography fontSize={15} fontWeight={600} color="black" mb={1}>
                {item.tag}
              </Typography>
            )}
            <Typography fontWeight={600} fontSize={34} color="black" mb={1}>
              {item.title}
            </Typography>
            {item.description && (
              <Typography color="black" mb={2}>
                {item.description}
              </Typography>
            )}
            <Button
              component={item.linkUrl ? "a" : "button"}
              href={item.linkUrl || undefined}
              target={item.linkUrl ? "_self" : undefined}
              sx={{
                width: "fit-content",
                color: "black",
                borderColor: "black",
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              }}
            >
              {item.button}
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
