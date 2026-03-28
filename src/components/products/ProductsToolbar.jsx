import { Box, Select, MenuItem, Slider, Stack, Typography, Button, Chip } from "@mui/material";

const PRICE_PRESETS = [
  { label: "< 5 triệu", range: [0, 5_000_000] },
  { label: "5 - 10 triệu", range: [5_000_000, 10_000_000] },
  { label: "10 - 20 triệu", range: [10_000_000, 20_000_000] },
  { label: "Toàn bộ", range: [0, 20_000_000] },
];

const PRICE_MARKS = [
  { value: 0, label: "0" },
  { value: 5_000_000, label: "5tr" },
  { value: 10_000_000, label: "10tr" },
  { value: 20_000_000, label: "20tr" },
];

export default function ProductsToolbar({
  sort,
  onSortChange,
  price,
  onPriceChange,
  categories = [],
  categorySlug = "all",
  onCategoryChange,
  totalItems,
  layout = "row",
}) {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const handlePriceChange = (_e, value) => {
    onPriceChange(value);
  };

  const handleCategoryChange = (e) => {
    onCategoryChange?.(e.target.value);
  };

  const handlePresetClick = (range) => {
    onPriceChange(range);
  };

  if (layout === "sidebar") {
    return (
      <Box
        sx={{
          p: 2
        }}
      >
        <Box justifyContent={"start"} display="flex">
          <Typography fontWeight={700} color="text.primary" mb={0.6}>
            Bộ lọc sản phẩm
          </Typography>

        </Box>
        <Box>
          <Box justifyContent={"start"} display="flex">
            <Typography fontSize={14} fontWeight={600} mb={0.8} color="text.primary">
              Sắp xếp
            </Typography>
          </Box>
          <Select fullWidth size="small" value={sort} onChange={handleSortChange}>
            <MenuItem value="az">Tên A-Z</MenuItem>
            <MenuItem value="za">Tên Z-A</MenuItem>
            <MenuItem value="price-asc">Giá thấp đến cao</MenuItem>
            <MenuItem value="price-desc">Giá cao đến thấp</MenuItem>
          </Select>
        </Box>

        <Stack spacing={2}>
          <Box>
            <Box justifyContent={"start"} display="flex">
              <Typography fontSize={14} fontWeight={600} mb={0.8} color="text.primary">
                Danh Mục
              </Typography>
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={0.8}>
              <Button
                size="small"
                onClick={() => onCategoryChange?.("all")}
                variant={categorySlug === "all" ? "contained" : "outlined"}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "rgba(219,39,119,0.35)",
                  color: categorySlug === "all" ? "#fff" : "#9d174d",
                  bgcolor: categorySlug === "all" ? "#db2777" : "transparent",
                  "&:hover": {
                    borderColor: "#be185d",
                    bgcolor: categorySlug === "all" ? "#be185d" : "rgba(219,39,119,0.08)",
                  },
                }}
              >
                Tất cả sản phẩm
              </Button>

              {categories.map((c) => {
                const value = c.slug ?? String(c.category_id ?? c.id);
                const active = categorySlug === value;
                return (
                  <Button
                    key={value}
                    size="small"
                    onClick={() => onCategoryChange?.(value)}
                    variant={active ? "contained" : "outlined"}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "rgba(219,39,119,0.35)",
                      color: active ? "#fff" : "#9d174d",
                      bgcolor: active ? "#db2777" : "transparent",
                      "&:hover": {
                        borderColor: "#be185d",
                        bgcolor: active ? "#be185d" : "rgba(219,39,119,0.08)",
                      },
                    }}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </Stack>
          </Box>

          <Box>
            <Box justifyContent={"start"} display="flex">
              <Typography fontSize={14} fontWeight={600} mb={0.8} color="text.primary">
                Khoảng giá
              </Typography>
            </Box>
            <Typography fontSize={12} mb={1}>
              Kéo hai đầu thanh để lọc theo ngân sách.
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1,
                borderRadius: 2,
                border: "1px solid rgba(15,23,42,0.1)",
                bgcolor: "rgba(248,250,252,0.85)",
                mb: 1,
              }}
            >
              <Chip
                size="small"
                label={`${price[0].toLocaleString()}₫`}
                sx={{ bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }}
              />
              <Typography fontSize={12} color="text.secondary">
                đến
              </Typography>
              <Chip
                size="small"
                label={`${price[1].toLocaleString()}₫`}
                sx={{ bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }}
              />
            </Stack>

            <Slider
              value={price}
              min={0}
              max={20_000_000}
              step={500_000}
              marks={PRICE_MARKS}
              onChange={handlePriceChange}
              valueLabelDisplay="off"
              sx={{
                mt: 0.4,
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                  bgcolor: "#db2777",
                },
                "& .MuiSlider-track": {
                  bgcolor: "#db2777",
                  border: "none",
                  height: 5,
                },
                "& .MuiSlider-rail": {
                  bgcolor: "rgba(148,163,184,0.35)",
                  height: 5,
                },
                "& .MuiSlider-markLabel": {
                  fontSize: 11,
                  color: "#64748b",
                },
              }}
            />

            <Stack direction="row" flexWrap="wrap" gap={0.8} mt={1.4}>
              {PRICE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  size="small"
                  variant="outlined"
                  onClick={() => handlePresetClick(preset.range)}
                  sx={{
                    borderColor: "rgba(219,39,119,0.35)",
                    color: "#9d174d",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#be185d",
                      bgcolor: "rgba(219,39,119,0.08)",
                    },
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </Stack>
          </Box>


        </Stack>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      flexWrap="wrap"
      gap={2}
    >
      <Box flex={1} minWidth={220}>
        <Slider
          value={price}
          min={0}
          max={20_000_000}
          step={500_000}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
        />
      </Box>

      <Stack direction="row" flexWrap="wrap" gap={0.8}>
        <Button
          size="small"
          onClick={() => onCategoryChange?.("all")}
          variant={categorySlug === "all" ? "contained" : "outlined"}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "rgba(219,39,119,0.35)",
            color: categorySlug === "all" ? "#fff" : "#9d174d",
            bgcolor: categorySlug === "all" ? "#db2777" : "transparent",
            "&:hover": {
              borderColor: "#be185d",
              bgcolor: categorySlug === "all" ? "#be185d" : "rgba(219,39,119,0.08)",
            },
          }}
        >
          Tất cả
        </Button>

        {categories.map((c) => {
          const value = c.slug ?? String(c.category_id ?? c.id);
          const active = categorySlug === value;
          return (
            <Button
              key={value}
              size="small"
              onClick={() => onCategoryChange?.(value)}
              variant={active ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "rgba(219,39,119,0.35)",
                color: active ? "#fff" : "#9d174d",
                bgcolor: active ? "#db2777" : "transparent",
                "&:hover": {
                  borderColor: "#be185d",
                  bgcolor: active ? "#be185d" : "rgba(219,39,119,0.08)",
                },
              }}
            >
              {c.name}
            </Button>
          );
        })}
      </Stack>

      <Select size="small" value={sort} onChange={handleSortChange}>
        <MenuItem value="az">Tên A–Z</MenuItem>
        <MenuItem value="za">Tên Z–A</MenuItem>
        <MenuItem value="price-asc">Giá thấp → cao</MenuItem>
        <MenuItem value="price-desc">Giá cao → thấp</MenuItem>
      </Select>
    </Box>
  );
}
