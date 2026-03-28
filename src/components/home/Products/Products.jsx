import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenericProductCard from "./card/GenericProductCard";
import { getAllProducts,getProductsFullApi } from "@/api/product.api";
import { Addtocart } from "@/components/cart/AddToCart";
import { useNavigate } from "react-router-dom";
import ProductListSkeleton from "@/components/common/ProductListSkeleton";
import { mapProductToCard } from "@/lib/utils";

export default function Products() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getProductsFullApi({ page: 1, limit: 10 });
        
        setCards(products.products.map(mapProductToCard));
      } catch (err) {
        console.error("Fetch products error:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box py={3}>
      <Typography
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight={700}
        fontSize={{ xs: 24, md: 32 }}
        mb={1}
      >
        <a href="" style={{ color: "#180a0a", fontWeight: 700 }}>
          Sản phẩm nổi bật
        </a>
      </Typography>

      <Typography align="center" color="#ababab" fontWeight={400} fontSize={14} mb={5}>
        Những sản phẩm được khách hàng yêu thích nhất
      </Typography>

      {loading && <ProductListSkeleton />}

      <Grid container spacing={3}>
        {!loading && cards?.length === 0 && (
          <Typography align="center" sx={{ width: "100%" }}>
            Không có sản phẩm
          </Typography>
        )}

        {cards.slice(0, 4).map((product, index) => {
          return (
            <Grid
              size={{ xs: 6, md: 3 }}
              key={product.id}
              data-aos={index % 2 === 0 ? "fade-up-left" : "fade-down-right"}
            >
              <GenericProductCard
                id={product.id}
                title={product.title}
                originalPrice={product.originalPrice}
                discountPercent={product.discountPercent}
                price={product.price}
                image={product.image}
                hoverImage={product.hoverImage}
                onAddToCart={() =>
                  Addtocart(product.variantId ?? product.id, 1, product.title, product.price, {
                    size: product?.size,
                    thickness: product?.thickness,
                    variantLabel:
                      product?.variantLabel ||
                      `${product?.size || ""} - ${product?.thickness || ""}`.trim(),
                    image: product.image,
                    selectedPromotion: product?.selectedPromotion || null,
                  })
                }
                onQuickView={() => navigate(`/product/${product.id}`)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
