import { useNavigate, Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function GenericProductCard({
  id,
  title,
  price,
  originalPrice,
  discountPercent,
  image,
  hoverImage,
  imageAlt = title,
  href,
  onAddToCart,
  onQuickView,
  sx,
}) {
  const navigate = useNavigate();
  const displayPrice =
    typeof price === "number"
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price)
      : price;

  const detailLink = href ?? (id ? `/product/${id}` : "#");

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        marginTop: 2,
        border: ` 1px solid #e0e0e0`,
        bgcolor: "transparent",
        textAlign: "center",
        cursor: "pointer",

        "&:hover .img-main": { opacity: 0 },
        "&:hover .img-hover": { opacity: 1, transform: "scale(1.05)" },
        "&:hover .actions": {
          opacity: 1,
          transform: "translate(-50%, 0)",
        },

        ...sx,
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "4/4",
        }}
      >
        {discountPercent && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "error.main",
              color: "white",
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              zIndex: 1,
            }}
          >
            -{discountPercent}%
          </Box>
        )}

        <MuiLink component={Link} to={detailLink} tabIndex={-1}>
          {/* Primary image */}
          <Box className="img-main" sx={{ transition: "all 0.5s ease" }}>
            <img
              src={image || "/image-placeholder.png"}
              alt={imageAlt}
              onError={(e) => {
                e.currentTarget.src = "/image-placeholder.png";
              }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </Box>

          {/* Hover image */}
          {hoverImage && hoverImage !== image && (
            <Box
              className="img-hover"
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                transition: "all 0.5s ease",
              }}
            >
              <img
                src={hoverImage}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </Box>
          )}
        </MuiLink>

        {/* ACTIONS */}
        <Box
          className="actions"
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translate(-50%, 20px)",
            display: "flex",
            gap: 1,
            opacity: 0,
            transition: "all 0.35s ease",
          }}
        >
          {onAddToCart && (
            <IconButton sx={iconStyle} onClick={handleAddToCart}>
              <ShoppingCartOutlinedIcon />
            </IconButton>
          )}

          {(onQuickView || id) && (
            <IconButton sx={iconStyle} onClick={() => navigate(detailLink)}>
              <VisibilityOutlinedIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* CONTENT */}
      <Box>
        <Typography
          variant="body2"
          sx={{
            mx: 1,
            fontSize: 16,
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          minHeight: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {originalPrice && (
          <Typography
            variant="caption"
            color="text.primary"
            sx={{ textDecoration: "line-through" }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(originalPrice)}
          </Typography>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {displayPrice}
        </Typography>
      </Box>
    </Card>
  );
}

const iconStyle = {
  bgcolor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  "&:hover": { bgcolor: "#f5f5f5" },
};
