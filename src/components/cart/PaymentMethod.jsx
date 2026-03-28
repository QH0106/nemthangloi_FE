import { useMemo } from "react";
import { Box, RadioGroup, FormControlLabel, Radio, Typography, Stack, Button, Chip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { toast } from "react-toastify";

const BANK_INFO = {
  bankName: "MB Bank",
  accountNo: "123456789",
  accountName: "NEM THANG LOI",
};

export default function PaymentMethod({ value, onChange, items = [], showQrDetails = true }) {
  const selectedItems = items.filter((i) => i.selected !== false);
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 10000000 ? 0 : 50000;
  const total = subtotal + shipping;

  const transferNote = useMemo(() => {
    const ts = Date.now().toString().slice(-6);
    return `NEMTHANGLOI ${ts}`;
  }, []);

  const qrPayload = useMemo(() => {
    return `BANK:${BANK_INFO.bankName};ACC:${BANK_INFO.accountNo};NAME:${BANK_INFO.accountName};AMOUNT:${total};NOTE:${transferNote}`;
  }, [total, transferNote]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrPayload)}`;

  const copyText = async (label, content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.info(`Không thể tự động sao chép. ${label}: ${content}`);
    }
  };

  return (
    <Box
      mt={2}
      sx={{
        p: { xs: 2, md: 2.3 },
        border: "1px solid rgba(219,39,119,0.2)",
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.84)",
      }}
    >
      <Typography sx={{ color: "#831843" }} fontWeight={600} fontSize={18} mb={0.8}>
        Phương thức thanh toán
      </Typography>

      <RadioGroup sx={{ color: "#0f172a" }} value={value} onChange={(e) => onChange(e.target.value)}>
        <FormControlLabel
          sx={{ color: "#0f172a" }}
          value="cod"
          control={<Radio sx={{ color: "#db2777", "&.Mui-checked": { color: "#be185d" } }} />}
          label="Thanh toán khi nhận hàng (COD)"
        />
        <FormControlLabel
          sx={{ color: "#0f172a" }}
          value="qr"
          control={<Radio sx={{ color: "#db2777", "&.Mui-checked": { color: "#be185d" } }} />}
          label="Thanh toán bằng QR Code"
        />
      </RadioGroup>

      {value === "qr" && showQrDetails ? (
        <Box
          sx={{
            mt: 1.5,
            borderRadius: 2.5,
            border: "1px solid rgba(219,39,119,0.25)",
            p: 1.6,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(253,242,248,0.9))",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <QrCode2Icon sx={{ color: "#be185d" }} />
              <Typography fontWeight={700} color="#831843">
                Quét mã QR để thanh toán
              </Typography>
            </Stack>
            <Chip label="Chờ thanh toán" size="small" sx={{ bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.8} alignItems="stretch">
            <Box
              sx={{
                alignSelf: "center",
                borderRadius: 2,
                p: 1,
                bgcolor: "#fff",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Box component="img" src={qrUrl} alt="QR thanh toán" sx={{ width: 184, height: 184, display: "block" }} />
            </Box>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography fontSize={13} >
                Số tiền cần chuyển
              </Typography>
              <Typography fontSize={22} fontWeight={800} color="#7e1644">
                {total.toLocaleString()}₫
              </Typography>

              <Stack spacing={0.7}>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Typography fontSize={14} sx={{ minWidth: 98, fontWeight: 700 }}>
                    Ngân hàng:
                  </Typography>
                  <Typography fontSize={14}>{BANK_INFO.bankName}</Typography>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Typography fontSize={14} sx={{ minWidth: 98, fontWeight: 700 }}>
                    STK:
                  </Typography>
                  <Typography fontSize={14}>{BANK_INFO.accountNo}</Typography>
                  <Button size="small" variant="text" sx={{ minWidth: 0, color: "#be185d" }} onClick={() => copyText("số tài khoản", BANK_INFO.accountNo)}>
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Typography fontSize={14} sx={{ minWidth: 98, fontWeight: 700 }}>
                    Tên TK:
                  </Typography>
                  <Typography fontSize={14}>{BANK_INFO.accountName}</Typography>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={1} flexWrap="wrap">
                  <Typography fontSize={14} sx={{ minWidth: 98, fontWeight: 700 }}>
                    Nội dung CK:
                  </Typography>
                  <Typography fontSize={14}>{transferNote}</Typography>
                  <Button size="small" variant="text" sx={{ minWidth: 0, color: "#be185d" }} onClick={() => copyText("nội dung chuyển khoản", transferNote)}>
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                </Stack>
              </Stack>

              <Typography fontSize={12}  sx={{ mt: 0.4 }}>
                Sau khi chuyển khoản, hệ thống sẽ xác nhận và liên hệ với bạn sớm nhất.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      ) : null}

      {value === "qr" && !showQrDetails ? (
        <Box
          sx={{
            mt: 1.2,
            p: 1.2,
            borderRadius: 2,
            border: "1px dashed rgba(219,39,119,0.4)",
            bgcolor: "rgba(253,242,248,0.6)",
          }}
        >
          <Typography fontSize={13} color="#9d174d" fontWeight={600}>
            Bạn đã chọn thanh toán QR. Nhấn tiếp tục để sang bước quét mã và xác nhận.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
