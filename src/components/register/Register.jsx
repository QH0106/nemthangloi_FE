import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "@/api/auth.api";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const pinkFieldSx = {
        "& .MuiInputLabel-root": { color: "#be185d" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#9d174d" },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(219, 39, 119, 0.35)",
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(219, 39, 119, 0.55)",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#be185d",
        },
    };

    const validate = () => {
        if (!name.trim()) return "Vui lòng nhập họ và tên";
        if (!email.trim()) return "Vui lòng nhập email";
        if (!password) return "Vui lòng nhập mật khẩu";
        if (password.length < 6) return "Mật khẩu cần ít nhất 6 ký tự";
        if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp";
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                password,
                phone: phone.trim() || null,
                address: address.trim() || null,
                avatar: avatar.trim() || null,
            };

            await registerApi(payload);
            navigate("/login");
        } catch (err) {
            setError(err?.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 980,
                mx: "auto",
                my: { xs: 2, md: 4 },
                px: { xs: 2, md: 3 },
            }}
        >
            <Box
                sx={{
                    borderRadius: 4,
                    border: "1px solid rgba(219, 39, 119, 0.25)",
                    background:
                        "linear-gradient(135deg, rgba(255, 248, 252, 0.96) 0%, rgba(254, 242, 248, 0.92) 100%)",
                    boxShadow: "0 20px 55px rgba(157, 23, 77, 0.15)",
                    overflow: "hidden",
                }}
            >
                <Stack direction={{ xs: "column", md: "row" }}>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "38%" },
                            p: { xs: 3, md: 4 },
                            color: "#f8fafc",
                            background:
                                "radial-gradient(circle at 20% 20%, #f9a8d4 0%, #ec4899 52%, #9d174d 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography fontSize={13} sx={{ opacity: 0.85, letterSpacing: 1.1, textTransform: "uppercase" }}>
                                Nệm Thắng Lợi
                            </Typography>
                            <br />
                            <Typography fontSize={{ xs: 26, md: 30 }} fontWeight={700} lineHeight={1.2} mt={1}>
                                Chào mừng bạn đến với cộng đồng khách hàng thân thiết
                            </Typography>
                            <br />
                            <Typography fontSize={14} sx={{ opacity: 0.9, mt: 1.5 }}>
                                Tạo tài khoản để đặt hàng nhanh hơn, theo dõi đơn và nhận ưu đãi sớm.
                            </Typography>
                        </Box>
                        <Box sx={{ fontSize: 13, opacity: 0.8 }}>
                            Bảo mật tài khoản bằng mật khẩu mạnh và thông tin chính xác.
                        </Box>
                    </Box>

                    <Box sx={{ width: { xs: "100%", md: "62%" }, p: { xs: 3, md: 4 } }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#831843">
                                Tạo tài khoản mới
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={1.5}>
                                <TextField
                                    size="small"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    label="Họ và tên"
                                    sx={pinkFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    size="small"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    sx={pinkFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <TextField
                                        size="small"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        fullWidth
                                        label="Số điện thoại"
                                        sx={pinkFieldSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        fullWidth
                                        label="Avatar URL"
                                        sx={pinkFieldSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>

                                <TextField
                                    size="small"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    fullWidth
                                    label="Địa chỉ"
                                    sx={pinkFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <HomeOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <TextField
                                        size="small"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        label="Mật khẩu"
                                        type={showPassword ? "text" : "password"}
                                        sx={pinkFieldSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        size="small"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        fullWidth
                                        label="Xác nhận mật khẩu"
                                        type={showConfirmPassword ? "text" : "password"}
                                        sx={pinkFieldSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>

                                {error ? (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                ) : null}

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        bgcolor: "#db2777",
                                        color: "#fff",
                                        py: 1.2,
                                        mt: 0.5,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        "&:hover": { bgcolor: "#be185d" },
                                    }}
                                >
                                    {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                                </Button>
                            </Stack>
                        </form>

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
                            <Typography fontSize={14} >
                                Đã có tài khoản?
                            </Typography>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                sx={{
                                    borderColor: "#db2777",
                                    color: "#9d174d",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": {
                                        borderColor: "#be185d",
                                        bgcolor: "rgba(219, 39, 119, 0.08)",
                                    },
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
