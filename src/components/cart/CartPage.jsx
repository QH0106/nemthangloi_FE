import { Box, Grid, Button, Typography, Stack, Chip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import CartItems from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";
import CheckoutForm from "@/components/cart/CheckoutForm";
import PaymentMethod from "@/components/cart/PaymentMethod";
import { useCart } from "@/context/CartContext";
import {
  addToCartApi,
  submitOrderGuestApi,
  submitOrderUserApi,
  updateOrderApi,
} from "@/api/cart.api";
import { setSessionCart } from "@/components/cart/AddToCart";

const initialForm = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  customer_address: "",
  note: "",
};

const getShippingFee = (lineItems = []) => {
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);
  return subtotal > 10000000 ? 0 : 50000;
};

const getApiPaymentMethod = (payment) => {
  return payment === "qr" ? "online" : "cod";
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};

const buildPromotionPayload = (item) => {
  const selectedPromotion = item?.selectedPromotion || null;
  const basePrice = Number(item?.basePrice ?? item?.price ?? 0) || 0;

  let discountAmount = Number(item?.discountValue || 0);
  if (selectedPromotion?.promotion_type === "discount_amount") {
    discountAmount = Math.max(0, Number(selectedPromotion?.discount_amount || 0));
  }
  if (selectedPromotion?.promotion_type === "discount_percent") {
    const percent = Math.max(0, Math.min(100, Number(selectedPromotion?.discount_percent || 0)));
    discountAmount = Math.round((basePrice * percent) / 100);
  }

  return {
    selected_promotion_id: Number(selectedPromotion?.promotion_id || 0) || null,
    promotion_type: selectedPromotion?.promotion_type || null,
    discount_amount: discountAmount,
    discount_percent: selectedPromotion?.promotion_type === "discount_percent"
      ? Number(selectedPromotion?.discount_percent || 0)
      : null,
    gift_title: selectedPromotion?.promotion_type === "gift"
      ? selectedPromotion?.gift_title || null
      : null,
  };
};

export default function CartPage() {
  const { items, setItems, updateQuantity, toggleSelect, refreshCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [payment, setPayment] = useState("cod");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const selectedItems = useMemo(
    () => items.filter((i) => i.selected !== false),
    [items],
  );
  const selectedCount = selectedItems.length;
  const totalSteps = payment === "qr" ? 3 : 2;
  const currentStepTitle =
    checkoutStep === 1
      ? "Bước 1: Xác nhận giỏ hàng"
      : checkoutStep === 2
        ? "Bước 2: Thông tin giao hàng và phương thức thanh toán"
        : "Bước 3: Quét QR và xác nhận thanh toán";

  const hydrateShippingFromUser = (user) => {
    if (!user) return;

    setCheckoutForm((prev) => ({
      ...prev,
      customer_name: prev.customer_name || user?.name || "",
      customer_email: prev.customer_email || user?.email || "",
      customer_phone: prev.customer_phone || user?.phone || "",
      customer_address: prev.customer_address || user?.address || "",
    }));
  };

  const validateForm = () => {
    const name = (checkoutForm.customer_name || "").trim();
    const email = (checkoutForm.customer_email || "").trim();
    const phone = (checkoutForm.customer_phone || "").trim();
    const address = (checkoutForm.customer_address || "").trim();
    const errors = {};

    if (!name) errors.customer_name = "Vui lòng nhập họ và tên.";
    if (!email) errors.customer_email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.customer_email = "Email không hợp lệ.";
    }
    if (!phone) errors.customer_phone = "Vui lòng nhập số điện thoại.";
    if (!address) errors.customer_address = "Vui lòng nhập địa chỉ giao hàng.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearStoredOrderId = () => {
    try {
      const user = getStoredUser();
      if (!user?.order_id) return;

      const { order_id, ...rest } = user;
      localStorage.setItem("currentUser", JSON.stringify(rest));
      window.dispatchEvent(new Event("userUpdated"));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (payment !== "qr" && checkoutStep > 2) {
      setCheckoutStep(2);
    }
    if (!items.length && checkoutStep !== 1) {
      setCheckoutStep(1);
    }
  }, [payment, items.length, checkoutStep]);

  useEffect(() => {
    refreshCart();
    // Intentionally run once when cart page opens to fetch latest cart state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const buyNowVariantId = location.state?.buyNowVariantId;
    if (!buyNowVariantId || !items.length) return;

    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: String(item.product_variant_id) === String(buyNowVariantId),
      })),
    );

    navigate(location.pathname, { replace: true, state: null });
  }, [items.length, location.pathname, location.state, navigate, setItems]);

  useEffect(() => {
    try {
      const localUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (localUser) {
        hydrateShippingFromUser(localUser);
      }
    } catch {
      // ignore
    }

    const onUserUpdated = () => {
      try {
        const nextUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (nextUser) hydrateShippingFromUser(nextUser);
      } catch {
        // ignore
      }
    };

    window.addEventListener("userUpdated", onUserUpdated);
    return () => window.removeEventListener("userUpdated", onUserUpdated);
  }, []);

  const submitOrder = async () => {
    if (!selectedItems.length) {
      toast.warning("Giỏ hàng trống.");
      return;
    }
    if (!validateForm()) {
      toast.warning("Vui lòng điền đủ thông tin giao hàng (ghi chú không bắt buộc).");
      return;
    }

    setSubmitting(true);
    setFormErrors({});
    try {
      const storedUser = getStoredUser();
      const userId = Number(storedUser?.user_id ?? storedUser?.id ?? 0);

      const shippingFee = getShippingFee(selectedItems);
      const paymentMethod = getApiPaymentMethod(payment);
      const selectedPayloadItems = selectedItems.map((i) => ({
        product_variant_id: Number(i.product_variant_id),
        quantity: Number(i.quantity) || 1,
        ...buildPromotionPayload(i),
      }));
      const customerPayload = {
        customer_name: (checkoutForm.customer_name || "").trim(),
        customer_email: (checkoutForm.customer_email || "").trim(),
        customer_phone: (checkoutForm.customer_phone || "").trim(),
        customer_address: (checkoutForm.customer_address || "").trim(),
      };

      if (userId > 0) {
        let orderId = Number(selectedItems[0]?.order_id || storedUser?.order_id || 0) || null;

        if (orderId) {
          await updateOrderApi(orderId, customerPayload, { _skipAuthLogout: true });
        } else {
          const cart = await addToCartApi(
            {
              user_id: userId,
              items: selectedPayloadItems,
            },
            { _skipAuthLogout: true },
          );

          orderId = Number(cart?.order_id || cart?.cart?.order_id || 0) || null;
          if (!orderId) {
            throw new Error("Không tìm thấy đơn hàng để xác nhận.");
          }

          try {
            const latestUser = getStoredUser();
            if (latestUser) {
              localStorage.setItem(
                "currentUser",
                JSON.stringify({ ...latestUser, order_id: orderId }),
              );
              window.dispatchEvent(new Event("userUpdated"));
            }
          } catch {
            // ignore
          }
        }

        await submitOrderUserApi(orderId, {
          payment_method: paymentMethod,
          shipping_fee: shippingFee,
          customer_email: customerPayload.customer_email,
          items: selectedItems.map((item) => ({
            order_item_id: Number(item.order_item_id),
            quantity: Number(item.quantity) || 1,
            ...buildPromotionPayload(item),
          })),
          note: (checkoutForm.note || "").trim() || null,
        });
      } else {
        await submitOrderGuestApi({
          ...customerPayload,
          payment_method: paymentMethod,
          shipping_fee: shippingFee,
          note: (checkoutForm.note || "").trim() || null,
          items: selectedPayloadItems,
        });
      }

      setCheckoutForm(initialForm);
      setFormErrors({});
      setPayment("cod");
      setCheckoutStep(1);

      if (userId > 0) {
        clearStoredOrderId();
        await refreshCart();
      } else {
        const remainingItems = items
          .filter((item) => item.selected === false)
          .map((item) => ({
            product_variant_id: Number(item.product_variant_id),
            quantity: Number(item.quantity) || 1,
            productName: item?.name || null,
            price: Number(item.price) || 0,
            basePrice: Number(item.basePrice ?? item.price) || 0,
            size: item?.size ?? null,
            thickness: item?.thickness ?? null,
            variantLabel: item?.variantLabel ?? null,
            image: item?.image ?? null,
            selectedPromotion: item?.selectedPromotion ?? null,
            discountValue: Number(item?.discountValue || 0),
          }));

        setSessionCart(remainingItems);
        setItems((prev) => prev.filter((item) => item.selected === false));
      }

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Đặt hàng thành công! Vui lòng kiểm tra email để theo dõi đơn hàng.");
    } catch (error) {
      console.error("[CartPage] Checkout error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể đặt hàng. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (checkoutStep === 1) {
      if (!selectedItems.length) {
        toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
        return;
      }
      setCheckoutStep(2);
      return;
    }

    if (checkoutStep === 2) {
      if (!validateForm()) {
        toast.warning("Vui lòng điền đủ thông tin giao hàng (ghi chú không bắt buộc).");
        return;
      }

      if (payment === "qr") {
        setCheckoutStep(3);
        return;
      }
    }

    await submitOrder();
  };

  const handleSelectAllItems = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: true })));
  };

  const handleUnselectAllItems = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: false })));
  };

  return (
    <Box minWidth="xl" px={{ xs: 1.5, md: 3 }} py={{ xs: 3, md: 6 }}>
      <Stack spacing={1} mb={3}>
        <Typography
          className=""
          variant="h4"
          color="#831843"
          fontWeight={600}
          sx={{ letterSpacing: 0.2 }}
        >
          Giỏ hàng của bạn
        </Typography>
        <Box display="flex" justifyContent={"space-between"} gap={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" rowGap={1}>
            <Chip
              label={`${items.length} sản phẩm`}
              sx={{ bgcolor: "rgba(219,39,119,0.12)", color: "#9d174d", fontWeight: 700 }}
            />
            <Chip
              label={`${selectedCount} đang chọn`}
              sx={{ bgcolor: "rgba(190,24,93,0.1)", color: "#9d174d", fontWeight: 700 }}
            />
            <Chip
              label={`Bước ${checkoutStep}/${totalSteps}`}
              sx={{ bgcolor: "rgba(131,24,67,0.08)", color: "#831843", fontWeight: 700 }}
            />
          </Stack>
          <Typography color="#831843" fontWeight={600}>
            {currentStepTitle}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <CartItems
            items={items}
            onUpdate={updateQuantity}
            onToggleSelect={toggleSelect}
            onSelectAll={handleSelectAllItems}
            onUnselectAll={handleUnselectAllItems}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 90 } }}>
            {checkoutStep === 1 ? <CartSummary items={items} /> : null}

            {checkoutStep === 2 ? (
              <>
                <CheckoutForm
                  value={checkoutForm}
                  onChange={setCheckoutForm}
                  errors={formErrors}
                />
                <PaymentMethod
                  value={payment}
                  onChange={setPayment}
                  items={selectedItems}
                  showQrDetails={false}
                />
              </>
            ) : null}

            {checkoutStep === 3 ? (
              <>
                <CartSummary items={selectedItems} />
                <PaymentMethod
                  value={payment}
                  onChange={setPayment}
                  items={selectedItems}
                  showQrDetails={true}
                />
              </>
            ) : null}

            {checkoutStep > 1 ? (
              <Button
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  mt: 2,
                  py: 1.1,
                  borderRadius: 3,
                  borderColor: "#db2777",
                  color: "#9d174d",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#be185d",
                    bgcolor: "rgba(219,39,119,0.08)",
                  },
                }}
                onClick={() => setCheckoutStep((prev) => Math.max(1, prev - 1))}
              >
                Quay lại
              </Button>
            ) : null}

            <Button
              fullWidth
              size="large"
              sx={{
                mt: 2.5,
                py: 1.3,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#db2777",
                color: "#fff",
                boxShadow: "0 14px 30px rgba(190, 24, 93, 0.24)",
                "&:hover": { bgcolor: "#be185d" },
                "&.Mui-disabled": { bgcolor: "#f3c5db", color: "#fff" },
              }}
              onClick={handlePrimaryAction}
              disabled={submitting || !selectedItems.length}
            >
              {submitting
                ? "Đang xử lý..."
                : checkoutStep === 1
                  ? "Tiếp tục nhập thông tin"
                  : checkoutStep === 2 && payment === "qr"
                    ? "Tiếp tục đến bước quét QR"
                    : "Đặt hàng"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
