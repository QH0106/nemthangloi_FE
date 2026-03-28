import { Box, TextField, Typography } from "@mui/material";

const textFieldPink = {
  "& .MuiInputLabel-root": { color: "#9d174d" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#831843" },
  "& input, & textarea": { color: "#0f172a" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(219,39,119,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(219,39,119,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#be185d" },
  },
};

export default function CheckoutForm({ value = {}, onChange, errors = {} }) {
  const { customer_name = "", customer_email = "", customer_phone = "", customer_address = "", note = "" } = value;

  const handleChange = (field) => (e) => {
    onChange?.({ ...value, [field]: e.target.value });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.3 },
        borderRadius: 3,
        border: "1px solid rgba(219,39,119,0.22)",
        bgcolor: "rgba(255,255,255,0.84)",
      }}
    >
      <Typography fontWeight={600} mb={1.5} color="#831843" fontSize={18}>
        Thông tin giao hàng
      </Typography>

      <TextField
        fullWidth
        sx={textFieldPink}
        label="Họ và tên"
        margin="dense"
        value={customer_name}
        onChange={handleChange("customer_name")}
        error={!!errors.customer_name}
        helperText={errors.customer_name}
        required
      />
      <TextField
        fullWidth
        sx={textFieldPink}
        label="Email"
        margin="dense"
        type="email"
        value={customer_email}
        onChange={handleChange("customer_email")}
        error={!!errors.customer_email}
        helperText={errors.customer_email}
        required
      />
      <TextField
        fullWidth
        sx={textFieldPink}
        label="Số điện thoại"
        margin="dense"
        value={customer_phone}
        onChange={handleChange("customer_phone")}
        error={!!errors.customer_phone}
        helperText={errors.customer_phone}
        required
      />
      <TextField
        fullWidth
        sx={textFieldPink}
        label="Địa chỉ giao hàng"
        margin="dense"
        value={customer_address}
        onChange={handleChange("customer_address")}
        error={!!errors.customer_address}
        helperText={errors.customer_address}
        required
      />
      <TextField
        fullWidth
        sx={textFieldPink}
        label="Ghi chú đơn hàng (không bắt buộc)"
        margin="dense"
        multiline
        minRows={3}
        value={note}
        onChange={handleChange("note")}
      />
    </Box>
  );
}
