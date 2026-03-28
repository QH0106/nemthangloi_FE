import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ProductsToolbar from "./ProductsToolbar";
import ProductsGrid from "./ProductsGrid";
import ProductsPagination from "./ProductsPagination";
import { getProductsFullApi } from "@/api/product.api";
import { useCategories } from "@/context/CategoriesContext";
import { useParams } from "react-router-dom";

const PER_PAGE = 10;

export default function ProductsPage() {
  const [sort, setSort] = useState("az");
  const [price, setPrice] = useState([0, 20_000_000]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { categories } = useCategories();
  const { slug } = useParams();
  const navigate = useNavigate();

  const activeCategorySlug = useMemo(() => slug ?? "all", [slug]);

  const activeCategoryId = useMemo(() => {
    if (!slug) return undefined;

    const match = categories.find((c) => (c.slug ?? String(c.id)) === slug);
    return match?.category_id ?? match?.id;
  }, [categories, slug]);

  const titleOfProducts = useMemo(() => {
    if (!slug) return "Tất cả sản phẩm";

    const match = categories.find((c) => (c.slug ?? String(c.id)) === slug);
    return match?.name ?? "Tất cả sản phẩm";
  }, [categories, slug]);

  const mapSortToParams = (value) => {
    switch (value) {
      case "price-asc":
        return { sortPrice: "asc" };
      case "price-desc":
        return { sortPrice: "desc" };
      default:
        return {};
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeCategoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [minPrice, maxPrice] = price;

        const params = {
          page,
          limit: PER_PAGE,
          min_price: minPrice,
          max_price: maxPrice,
          ...(activeCategoryId ? { category_id: activeCategoryId } : {}),
          ...mapSortToParams(sort),
        };

        const { products, pagination } = await getProductsFullApi(params);

        let normalized = Array.isArray(products) ? [...products] : [];

        if (sort === "az") {
          normalized.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sort === "za") {
          normalized.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        }

        setItems(normalized);

        let serverTotalPages =
          pagination?.totalPages ??
          pagination?.total_pages ??
          (pagination?.totalItems || pagination?.total_items
            ? Math.ceil(
              (pagination.totalItems || pagination.total_items) /
              (pagination.limit || PER_PAGE),
            )
            : undefined);

        setTotalPages(serverTotalPages || 1);
      } catch (err) {
        console.error("Fetch products listing error:", err);
        setError(
          err?.response?.data?.message || "Không tải được danh sách sản phẩm.",
        );
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, price, sort, activeCategoryId]);

  const handleSortChange = (next) => {
    setSort(next);
    setPage(1);
  };

  const handlePriceChange = (next) => {
    setPrice(next);
    setPage(1);
  };

  const handlePageChange = (next) => {
    setPage(next);
  };

  const handleCategoryChange = (nextSlug) => {
    setPage(1);
    if (!nextSlug || nextSlug === "all") {
      navigate("/products");
      return;
    }
    navigate(`/products/${nextSlug}`);
  };
console.log(items);

  return (
    <Box px={{ xs: 1.5, md: 2.5 }} py={{ xs: 2, md: 0 }}>
      <Box
        sx={{
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          mb: 2,
          boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
        }}
      >
        <Box
          component="img"
          src="https://nemthangloi.com/wp-content/uploads/2025/01/CAOSUTHIENNHIEN-min-2048x766.jpg"
          alt="Banner sản phẩm"
          sx={{
            width: "100%",
            height: { xs: 140, sm: 180, md: 250 },
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </Box>

      <Typography variant="h4" fontWeight={600} textAlign="center" color="text.primary" mb={3}>
        {titleOfProducts}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
            <ProductsToolbar
              sort={sort}
              onSortChange={handleSortChange}
              price={price}
              onPriceChange={handlePriceChange}
              categories={categories}
              categorySlug={activeCategorySlug}
              onCategoryChange={handleCategoryChange}
              totalItems={items.length}
              layout="sidebar"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <ProductsGrid products={items} loading={loading} priceRange={price} />
          {items.length > 0 && (
            <ProductsPagination
              page={page}
              total={totalPages}
              onChange={handlePageChange}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
