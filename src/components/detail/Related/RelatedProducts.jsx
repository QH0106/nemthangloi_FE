import { Grid, Typography } from "@mui/material";
import GenericProductCard from "../../home/Products/card/GenericProductCard";

export default function RelatedProducts({ products }) {
  return (
    <>
      <Typography
        color="#000000"
        variant="h5"
        textAlign="center"
        mt={10}
        mb={4}
      >
        Bạn có thể thích
      </Typography>

      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid size={{ xs: 6, md: 3 }} key={p.id}>
            <GenericProductCard
              id={p.id}
              title={p.name}
              price={String(p.price)}
              image={p.image}
              hoverImage={p.hoverImage}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
