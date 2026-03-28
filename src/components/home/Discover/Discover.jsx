import { Grid, Box, Typography, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { discoverData } from "./Discover.data";
import { getBannersApi } from "@/api/banner.api";

export default function Discover() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchDiscover = async () => {
      const data = await getBannersApi({ banner_type: "discover" });
      if (!mounted) return;
      setItems(Array.isArray(data) ? data : []);
    };

    fetchDiscover();

    return () => {
      mounted = false;
    };
  }, []);

  const discoverItems = useMemo(() => {
    if (items.length > 0) {
      return items.map((item) => ({
        key: item?.banner_id ?? item?.id,
        title: item?.title,
        image: item?.image,
        link: item?.link_url || "/products",
        button: item?.button || "xem thêm →",
      }));
    }

    return discoverData;
  }, [items]);

  return (
    <Box py={3}>
      <Typography
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        align="center"
        fontWeight={600}
        fontSize={{ xs: 24, md: 32 }}
        mb={4}
        color="black"
      >
        Sản Phẩm Của Chúng Tôi
      </Typography>

      <Grid container spacing={2}>
        {discoverItems.map((item, index) => (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={item.key || item.title}
            data-aos={index % 2 === 0 ? "fade-up-right" : "fade-up-left"}
            data-aos-delay={index * 300}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  height: 280,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography color="black" fontWeight={600}>
                  {item.title}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    if (!item.link) return;
                    navigate(item.link);
                  }}
                  sx={{
                    color: "black",
                    width: "fit-content",
                    textTransform: "none",
                  }}
                >
                  {item.button || "xem thêm →"}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
