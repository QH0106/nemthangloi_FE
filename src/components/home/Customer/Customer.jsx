import { Box, Grid, Typography, Stack } from "@mui/material";
import { customersSection } from "./Customer.data";
import GenericProductCard from "../Products/card/GenericProductCard";
export default function CustomerFavorites() {
  const { title, subtitle, products } = customersSection;

  return (
    <Box pt={3}>
      <Stack spacing={1} alignItems="center" mb={3}>
        <Typography fontWeight={700} color="#180a0a" fontSize={{ xs: 24, md: 32 }}>
          {title}
        </Typography>
        <Typography color="#ababab" fontWeight={400} fontSize={14}>
          {subtitle}
        </Typography>
      </Stack>

      <Grid container spacing={3} justifyContent="center">
            {products.map((item, index) => (
              <Grid
                size={{ xs: 6, md: 3 }}
                key={item.id}
                data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
              >
                <GenericProductCard
                  id={item.id}
                  title={item.name}
                  hoverImage={item.hoverImage}
                  price={item.price}
                  image={item.image}
                />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}
