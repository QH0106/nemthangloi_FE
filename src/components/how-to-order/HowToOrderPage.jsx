import { Box, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

const StepBox = ({ step, title, children }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        borderColor: "rgba(0,0,0,0.12)",
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight={800} color="text.primary">
          Bước {step}: {title}
        </Typography>
        <Box sx={{ color: "text.primary" }}>{children}</Box>
      </Stack>
    </Paper>
  );
};

export default function HowToOrderPage() {
  return (
    <Container sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography variant="h4" fontWeight={900} color="text.primary">
            Hướng dẫn đặt hàng online
          </Typography>
          <Typography color="text.primary">
            Quý khách thao tác đặt hàng trên website qua trình tự các bước như sau:
          </Typography>
        </Stack>

        <StepBox step={1} title="Chọn sản phẩm cần mua">
          <Typography color="text.primary">
            Chọn sản phẩm tại danh sách sản phẩm trên{" "}
            <MuiLink
              component={RouterLink}
              to="/"
              underline="always"
              sx={{ fontWeight: 700, color: "#9f0a0a" }}
            >
              Trang chủ
            </MuiLink>{" "}
            hoặc truy cập{" "}
            <MuiLink
              component={RouterLink}
              to="/products"
              underline="always"
              sx={{ fontWeight: 700, color: "#9f0a0a" }}
            >
              Sản phẩm
            </MuiLink>
            .
          </Typography>
        </StepBox>

        <StepBox step={2} title="Chọn độ dày & kích thước, bấm “Chọn mua”">
          <Typography color="text.primary">
            Ở trang chi tiết sản phẩm, vui lòng chọn <b>ĐỘ DÀY</b>,{" "}
            <b>KÍCH THƯỚC</b> phù hợp và bấm <b>“CHỌN MUA”</b>.
          </Typography>
        </StepBox>

        <StepBox step={3} title="Kiểm tra popup thanh toán, bấm “Thanh toán”">
          <Typography color="text.primary">
            Màn hình sẽ hiển thị popup thanh toán. Vui lòng kiểm tra lại thông tin
            đơn hàng và bấm <b>“THANH TOÁN”</b>.
          </Typography>
        </StepBox>

        <StepBox step={4} title="Hoàn tất thông tin đặt hàng">
          <Stack spacing={1}>
            <Typography color="text.primary">
              Quý khách chọn hình thức thanh toán, sau đó nhập đầy đủ thông tin và
              bấm <b>“THANH TOÁN”</b>. Như vậy là đã đặt hàng thành công.
            </Typography>
            <Typography color="text.primary">
              Sau khi nhận được thông báo, nhân viên bán hàng của{" "}
              <b>Nệm Thắng Lợi</b> sẽ liên hệ số điện thoại của quý khách để xác nhận
              đơn hàng và giao hàng.
            </Typography>
            <Typography fontStyle="italic" fontWeight={700} color="text.primary">
              Trân trọng cảm ơn quý khách!
            </Typography>
          </Stack>
        </StepBox>

        <Divider />

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 2,
            borderColor: "rgba(0,0,0,0.12)",
            bgcolor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={900} color="text.primary">
              Thông tin liên hệ
            </Typography>

            <Typography color="text.primary">
              <b>KHO NỆM THẮNG LỢI</b> - Website chính thức của thương hiệu Nệm Thắng
              Lợi
            </Typography>

            <Stack spacing={0.5}>
              <Typography color="text.primary">
                <b>Địa chỉ nhà máy</b>: Lô C10, Cụm CN Nhựa Đức Hòa, ấp Bình Tiên 2,
                Xã Đức Hòa Hạ, Huyện Đức Hòa, Tỉnh Long An
              </Typography>
              <Typography color="text.primary">
                <b>Cửa hàng 1</b>: 163 Phan Văn Hớn, Xã Bà Điểm, Huyện Hóc Môn, TP.
                Hồ Chí Minh
              </Typography>
              <Typography color="text.primary">
                <b>Cửa hàng 2</b>: 01 Phạm Văn Sáng, Ấp 21, Xã Bà Điểm, Huyện Hóc
                Môn, TP. Hồ Chí Minh
              </Typography>
              <Typography color="text.primary">
                (Quý khách có nhu cầu ghé cửa hàng trải nghiệm trực tiếp, vui lòng
                liên hệ để đặt lịch trước qua Hotline bên dưới)
              </Typography>
            </Stack>

            <Stack spacing={0.25}>
              <Typography color="text.primary">
                <b>Hotline</b>: 0964 559 252
              </Typography>
              <Typography color="text.primary">
                <b>Mail</b>: khonemthangloi.vn@gmail.com
              </Typography>
              <Typography color="text.primary">
                <b>Lịch làm việc</b>: 7h:00 - 22h:00
              </Typography>
            </Stack>

            <Divider sx={{ my: 0.5 }} />

            <Typography variant="subtitle1" fontWeight={900} color="text.primary">
              Thông tin thanh toán
            </Typography>
            <Stack spacing={0.25}>
              <Typography color="text.primary">
                <b>Ngân hàng</b>: Sacombank - Chi nhánh Tân Bình
              </Typography>
              <Typography color="text.primary">
                <b>STK</b>: 0603 6527 9999
              </Typography>
              <Typography color="text.primary">
                <b>Tên tài khoản</b>: Công Ty TNHH Nệm Thắng Lợi
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

