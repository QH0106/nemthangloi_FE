import { Box } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import InnerImageZoom from "react-inner-image-zoom";

const PLACEHOLDER_SRC = "/image-placeholder.png";

/**
 * Normalize images from API shape or URL array to list of URL strings (main first).
 * API: { data: { images: [{ url, is_main, image_id, ... }] } }
 */
function normalizeToUrlList(images) {
  if (!images?.length) return [];
  const first = images[0];
  if (typeof first === "string") {
    return images.filter(Boolean);
  }
  const withUrl = images
    .map((img) => ({ url: img?.url, is_main: !!img?.is_main, image_id: img?.image_id }))
    .filter((img) => img.url);
  withUrl.sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0));
  return withUrl.map((img) => img.url);
}

export default function ProductGallery({ images }) {
  const [active, setActive] = useState(0);
  const [failedUrls, setFailedUrls] = useState(new Set());

  const displayList = useMemo(() => {
    const list = normalizeToUrlList(images);
    return list.length ? list : [PLACEHOLDER_SRC];
  }, [images]);

  const displayImage = failedUrls.has(displayList[active]) ? PLACEHOLDER_SRC : (displayList[active] ?? PLACEHOLDER_SRC);

  const handleImageError = useCallback((url) => {
    setFailedUrls((prev) => new Set(prev).add(url));
  }, []);

  return (
    <Box>
      {/* MAIN IMAGE */}
      <Box
        sx={{
          width: "100%",
          "& img": {
            width: "100%",
            height: "500px",
            display: "block",
            borderRadius: 2,
            border: "0.5px solid #ddd",
            objectFit: "contain",
          },
        }}
      >
        <img
          alt=""
          aria-hidden
          src={displayList[active]}
          onError={() => handleImageError(displayList[active])}
          style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        />
        <InnerImageZoom
          key={displayImage}
          src={displayImage}
          zoomSrc={displayImage}
          zoomType="hover"
          zoomScale={0.5}
        />
      </Box>

      {/* THUMBNAILS */}
      {displayList.length > 1 && (
        <Box display="flex" gap={1} mt={2} flexWrap="wrap" sx={{ maxWidth: "100%" }}>
          {displayList.map((url, index) => {
            const src = failedUrls.has(url) ? PLACEHOLDER_SRC : (url ?? PLACEHOLDER_SRC);
            return (
              <Box
                key={url ? `${url}-${index}` : index}
                component="img"
                src={src}
                alt={`Ảnh sản phẩm ${index + 1}`}
                onClick={() => setActive(index)}
                onError={() => handleImageError(url)}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  cursor: "pointer",
                  objectFit: "cover",
                  border: active === index ? "2px solid #000" : "1px solid #ddd",
                  transition: "all 0.3s ease",
                  flex: "0 0 auto",
                  "&:hover": {
                    borderColor: "#000",
                    transform: "scale(1.05)",
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}
