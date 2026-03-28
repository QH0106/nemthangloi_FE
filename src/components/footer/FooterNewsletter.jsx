import { Box, Stack, TextField, Button } from "@mui/material";
import { footerNewsletter } from "./footer.data";
import FooterTitle from "./FooterTitle";

export default function FooterNewsletter() {
  const getFieldType = (fieldName) => {
    if (fieldName === "email") return "email";
    if (fieldName === "phone") return "tel";
    return "text";
  };

  return (
    <Stack>
      <FooterTitle title={footerNewsletter.title} color="black" />

      <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
        <Stack spacing={1.2}>
          {footerNewsletter.fields.map((field) => (
            <TextField
              key={field.name}
              type={getFieldType(field.name)}
              placeholder={field.placeholder}
              multiline={field.multiline}
              minRows={field.multiline ? 3 : undefined}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ bgcolor: "#fff" }}
            />
          ))}

          <Button
            sx={{
              bgcolor: "#d32f2f",
              color: "#fff",
              mt: 1,
              boxShadow: 2,
              "&:hover": {
                bgcolor: "#b71c1c",
                boxShadow: 4,
              },
            }}
          >
            {footerNewsletter.submitLabel}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
