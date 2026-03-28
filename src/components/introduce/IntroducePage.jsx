import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const INTRO_HISTORY_TEXT = `Công ty TNHH Nệm Thắng Lợi được thành lập vào ngày 22/02/2017 với mục tiêu mang đến giấc ngủ chất lượng cho hàng triệu gia đình Việt. Sau gần 10 năm hình thành và phát triển, Nệm Thắng Lợi hiện đang sở hữu cụm 3 nhà máy sản xuất với tổng diện tích lên đến gần 20.000 m2, mạng lưới 10 cửa hàng chi nhánh chính thức tại các tỉnh, hơn 4000 đại lý toàn quốc và hơn 250 cán bộ công nhân viên.

Từ một doanh nghiệp nhỏ, nhờ sự nỗ lực hết mình của toàn thể cán bộ công nhân viên; sự kề vai sát cánh của quý khách hàng, quý đối tác; cùng tầm nhìn chiến lược rõ ràng của Ban lãnh đạo, quan điểm phát triển bền vững và khát vọng vươn xa, Nệm Thắng Lợi đã không ngừng trưởng thành và lớn mạnh. Trong gần 10 năm năm qua, Công ty TNHH Nệm Thắng Lợi vinh dự nhận được nhiều giải thưởng, chứng nhận danh giá như “Top 10 Thương hiệu mạnh quốc gia 2020”; “Hàng Việt Nam Chất Lượng Cao được người tiêu dùng bình chọn” ba năm liên tiếp 2022 – 2024; “Hàng Việt Nam Chất Lượng Cao – Chuẩn Hội Nhập”,… Điều này là minh chứng cho những nỗ lực không ngừng nghỉ của Nệm Thắng Lợi trong việc đem đến cho người Việt những sản phẩm  phụ vụ giấc ngủ chất lượng.`;

const CULTURE_TEXT = `Thành công của Thắng Lợi không thể thiếu sự đóng góp của đội ngũ nhân viên tận tâm, giàu kinh nghiệm. Họ không chỉ là những người thợ lành nghề mà còn là những người đam mê sáng tạo, luôn nỗ lực để mang đến những sản phẩm tốt nhất cho khách hàng. Thắng Lợi cũng chú trọng đào tạo và phát triển nhân tài, tạo điều kiện cho nhân viên phát triển toàn diện cả về chuyên môn và kỹ năng mềm.`;

const SECTION_IMAGES = [
  { src: "/lich-su-hinh-thanh.jpg", alt: "Lịch sử hình thành" },
  { src: "/tam-nhin-su-menh.jpg", alt: "Tầm nhìn sứ mệnh" },
  { src: "/GIA-TRI-COT-LOI.jpg", alt: "Giá trị cốt lõi" },
  { src: "/MUC-TIEU.jpg", alt: "Mục tiêu" },
  { src: "/QUYEN-LOI.jpg", alt: "Quyền lợi" },
  { src: "/CHUNG-NHAN.jpg", alt: "Chứng nhận" },
  { src: "/QUY-MO.jpg", alt: "Quy mô" },
];

const IntroducePage = () => {
  return (
    <Stack
      spacing={{ xs: 2.5, md: 4 }}
      sx={{ px: { xs: 1.25, sm: 2, md: 3 } }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: { xs: 1.5, md: 2 },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="/gioithieu.jpg"
          alt="Giới thiệu"
          sx={{
            width: "100%",
            height: { xs: 140, sm: 200, md: "auto" },
            display: "block",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Box>

      <Stack spacing={{ xs: 1.25, md: 2 }} px={{ xs: 0.5, md: 2 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" } }}
        >
          LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: { xs: 1.7, md: 1.85 },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            textAlign: { xs: "left", md: "justify" },
          }}
        >
          {INTRO_HISTORY_TEXT}
        </Typography>
      </Stack>

      <Stack spacing={{ xs: 1.5, md: 2 }}>
        {SECTION_IMAGES.map((image) => (
          <Box
            key={image.src}
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: { xs: 1.5, md: 2 },
            }}
          />
        ))}
      </Stack>

      <Stack spacing={{ xs: 1.25, md: 2 }} px={{ xs: 0.5, md: 2 }} pb={{ xs: 2, md: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" } }}
        >
          VĂN HOÁ - NGƯỜI THẮNG LỢI
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: { xs: 1.7, md: 1.85 },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            textAlign: { xs: "left", md: "justify" },
          }}
        >
          {CULTURE_TEXT}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default IntroducePage;