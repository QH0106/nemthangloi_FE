import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PasswordIcon from "@mui/icons-material/Password";
import { Link } from "react-router-dom";
import { forgotPasswordApi, resendOtpApi, verifyOtpApi } from "@/api/auth.api";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const helperText = useMemo(() => {
        if (step === 1) {
            return "Bước 1: Nhập email để nhận mã OTP.";
        }

        return "Bước 2: Nhập OTP để hệ thống tạo mật khẩu mới và gửi về email.";
    }, [step]);

    const sendOtp = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Vui lòng nhập email");
            return;
        }

        setLoading(true);
        try {
            const res = await forgotPasswordApi(email.trim());
            setSuccess(res?.message || "OTP đang được gửi tới email của bạn");
            setStep(2);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể gửi OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() || !otp.trim()) {
            setError("Vui lòng nhập đầy đủ email và OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtpApi(email.trim(), otp.trim());
            setSuccess(
                res?.message ||
                "Đặt lại mật khẩu thành công. Vui lòng kiểm tra email để lấy mật khẩu mới.",
            );
            setOtp("");
        } catch (err) {
            setError(err?.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Vui lòng nhập email trước khi gửi lại OTP");
            return;
        }

        setResending(true);
        try {
            const res = await resendOtpApi(email.trim());
            setSuccess(res?.message || "Đã gửi lại OTP");
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể gửi lại OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 940,
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
                            width: { xs: "100%", md: "40%" },
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
                                Quên mật khẩu
                            </Typography>
                            <br />
                            <Typography fontSize={14} sx={{ opacity: 0.9, mt: 1.5 }}>
                                Hệ thống sẽ xác thực OTP và gửi mật khẩu mới qua email của bạn.
                            </Typography>
                        </Box>

                        <Typography fontSize={13} sx={{ opacity: 0.8 }}>
                            Luồng BE hiện tại không nhập mật khẩu mới tại form, mật khẩu mới được gửi qua email.
                        </Typography>
                    </Box>

                    <Box sx={{ width: { xs: "100%", md: "60%" }, p: { xs: 3, md: 4 } }}>
                        <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#831843">
                            Khôi phục tài khoản
                        </Typography>
                        <br />
                        <Typography color="text.primary" fontSize={14} mt={0.5}>
                            {helperText}
                        </Typography>

                        <form onSubmit={step === 1 ? sendOtp : verifyOtp}>
                            <Stack spacing={1.5} mt={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email"
                                    sx={pinkFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {step === 2 ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        label="Mã OTP"
                                        sx={pinkFieldSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PasswordIcon sx={{ fontSize: 19, color: "#be185d" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                ) : null}

                                {error ? (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                ) : null}

                                {success ? (
                                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                                        {success}
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
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        "&:hover": { bgcolor: "#be185d" },
                                    }}
                                >
                                    {loading
                                        ? "Đang xử lý..."
                                        : step === 1
                                            ? "Gửi OTP"
                                            : "Xác thực OTP và đặt lại mật khẩu"}
                                </Button>

                                {step === 2 ? (
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="outlined"
                                        disabled={resending}
                                        onClick={resendOtp}
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
                                        {resending ? "Đang gửi lại OTP..." : "Gửi lại OTP"}
                                    </Button>
                                ) : null}
                            </Stack>
                        </form>

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1}>
                            <Typography fontSize={14} >
                                Nhớ mật khẩu rồi?
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
                                Quay lại đăng nhập
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
