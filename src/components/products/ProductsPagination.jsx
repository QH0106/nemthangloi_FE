import { Pagination, Box } from "@mui/material";



export default function ProductsPagination({ page, total, onChange }) {
  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Pagination page={page} count={total} onChange={(_, p) => onChange(p)} />
    </Box>
  );
}
