import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getBannersApi } from "@/api/banner.api";

const ProductBanner = () => {
  const fallbackProducts = [
    { name: "Nem Thang Loi 1", image: "/bg_nemthangloi1.png" },
    { name: "Nem Thang Loi 2", image: "/bg_nemthangloi2.png" },
    { name: "Nem Thang Loi 3", image: "/bg_nemthangloi3.png" },
  ];
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchProductBanners = async () => {
      const banners = await getBannersApi({ banner_type: "product" });
      if (!mounted) return;
      setItems(Array.isArray(banners) ? banners : []);
    };

    fetchProductBanners();

    return () => {
      mounted = false;
    };
  }, []);

  const products = useMemo(() => {
    if (items.length > 0) {
      return items.map((item) => ({
        name: item?.title || "Product Banner",
        image: item?.image,
      }));
    }

    return fallbackProducts;
  }, [items]);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <Box
      width="100vw"
      height={"100%"}
      overflow="hidden"
      position="relative"
      sx={{
        left: "50%",
        marginLeft: "-50vw",
      }}
    >
      <Box ref={emblaRef} overflow="hidden" height="100%">
        <Box display="flex" height="100%">
          {products.map((item, index) => (
            <Box key={index} flex="0 0 100%" height="100%">
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100vw",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductBanner;
