import { toast } from "react-toastify";
import { addToCartApi } from "@/api/cart.api";

const GUEST_CART_KEY = "guest_cart_id";
export const SESSION_CART_KEY = "session_cart";
export const PROMOTION_SELECTIONS_KEY = "selected_variant_promotions";

const readCartList = (storage, key) => {
  try {
    const raw = storage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCartList = (storage, key, items) => {
  try {
    storage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const getGuestCartId = () => {
  try {
    const existing = localStorage.getItem(GUEST_CART_KEY);
    if (existing && typeof existing === "string") {
      return existing;
    }
  } catch {
    // ignore
  }

  let id;
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      id = crypto.randomUUID();
    } else {
      id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }
  } catch {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  try {
    localStorage.setItem(GUEST_CART_KEY, id);
  } catch {
    // ignore
  }

  return id;
};

export const getSessionCart = () => {
  const localCart = readCartList(localStorage, SESSION_CART_KEY);
  if (localCart.length) return localCart;

  // One-time migration for users who still have cart data in sessionStorage.
  const sessionCart = readCartList(sessionStorage, SESSION_CART_KEY);
  if (sessionCart.length) {
    writeCartList(localStorage, SESSION_CART_KEY, sessionCart);
    try {
      sessionStorage.removeItem(SESSION_CART_KEY);
    } catch {
      // ignore
    }
  }

  return sessionCart;
};

export const setSessionCart = (items) => {
  writeCartList(localStorage, SESSION_CART_KEY, items);

  // Keep old key clean in case previous versions wrote to sessionStorage.
  try {
    sessionStorage.removeItem(SESSION_CART_KEY);
  } catch {
    // ignore
  }
};

const readPromotionSelections = () => {
  try {
    const raw = localStorage.getItem(PROMOTION_SELECTIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writePromotionSelections = (next) => {
  try {
    localStorage.setItem(PROMOTION_SELECTIONS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

export const getPromotionSelectionByVariantId = (variantId) => {
  const selections = readPromotionSelections();
  return selections?.[String(variantId)] || null;
};

export const setPromotionSelectionForVariantId = (variantId, promotion) => {
  if (!variantId) return;

  const selections = readPromotionSelections();
  const key = String(variantId);

  if (!promotion) {
    delete selections[key];
  } else {
    selections[key] = promotion;
  }

  writePromotionSelections(selections);
};

export const getPromotionPriceAdjustment = (basePrice = 0, promotion = null) => {
  const numericBase = Number(basePrice) || 0;
  if (!promotion || !promotion.promotion_type) {
    return { finalPrice: numericBase, discountValue: 0 };
  }

  if (promotion.promotion_type === "discount_amount") {
    const amount = Math.max(0, Number(promotion.discount_amount) || 0);
    return {
      finalPrice: Math.max(0, numericBase - amount),
      discountValue: amount,
    };
  }

  if (promotion.promotion_type === "discount_percent") {
    const percent = Math.max(0, Math.min(100, Number(promotion.discount_percent) || 0));
    const discount = Math.round((numericBase * percent) / 100);
    return {
      finalPrice: Math.max(0, numericBase - discount),
      discountValue: discount,
    };
  }

  return { finalPrice: numericBase, discountValue: 0 };
};


export const Addtocart = (
  productVariantId,
  quantity = 1,
  productName,
  price = 0,
  meta = {},
) => {
  if (!productVariantId) {
    toast.error("Sản phẩm không hợp lệ");
    return false;
  }

  const readCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  };

  const user = readCurrentUser();
  const userId = Number(user?.user_id ?? user?.id ?? 0);
  const isLoggedIn = userId > 0;

  if (Object.prototype.hasOwnProperty.call(meta, "selectedPromotion")) {
    setPromotionSelectionForVariantId(productVariantId, meta.selectedPromotion || null);
  }

  const selectedPromotion = meta?.selectedPromotion || null;
  const numericBasePrice = Number(price) || 0;
  const { discountValue } = getPromotionPriceAdjustment(numericBasePrice, selectedPromotion);

  const promotionPayload = {
    selected_promotion_id: Number(selectedPromotion?.promotion_id || 0) || null,
    promotion_type: selectedPromotion?.promotion_type || null,
    discount_amount: Number(discountValue || 0),
    discount_percent: selectedPromotion?.promotion_type === "discount_percent"
      ? Number(selectedPromotion?.discount_percent || 0)
      : null,
    gift_title: selectedPromotion?.promotion_type === "gift"
      ? selectedPromotion?.gift_title || null
      : null,
  };

  if (isLoggedIn) {
    return addToCartApi(
      {
        user_id: userId,
        items: [
          {
            product_variant_id: Number(productVariantId),
            quantity: Number(quantity) || 1,
            ...promotionPayload,
          },
        ],
      },
      { _skipAuthLogout: true },
    )
      .then((cart) => {
        const syncedOrderId = cart?.order_id || null;
        if (syncedOrderId) {
          try {
            const latestUser = readCurrentUser();
            if (latestUser) {
              localStorage.setItem(
                "currentUser",
                JSON.stringify({ ...latestUser, order_id: syncedOrderId }),
              );
              window.dispatchEvent(new Event("userUpdated"));
            }
          } catch {
            // ignore
          }
        }

        toast.success(`${productName ?? productVariantId} đã thêm vào giỏ hàng!`);
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Thêm vào giỏ thất bại, vui lòng thử lại.";
        toast.error(message);
        return false;
      });
  }

  const list = getSessionCart();
  const existingIndex = list.findIndex(
    (i) => Number(i.product_variant_id) === Number(productVariantId)
  );

  let next;
  if (existingIndex >= 0) {
    next = list.slice();
    const existingPrice = Number(next[existingIndex]?.basePrice ?? next[existingIndex]?.price ?? price) || 0;
    const promotion = meta?.selectedPromotion ?? next[existingIndex]?.selectedPromotion ?? null;
    const { finalPrice, discountValue } = getPromotionPriceAdjustment(existingPrice, promotion);

    next[existingIndex] = {
      ...next[existingIndex],
      quantity: (next[existingIndex].quantity || 0) + quantity,
      size: next[existingIndex]?.size ?? meta?.size ?? null,
      thickness: next[existingIndex]?.thickness ?? meta?.thickness ?? null,
      variantLabel: next[existingIndex]?.variantLabel ?? meta?.variantLabel ?? null,
      image: next[existingIndex]?.image ?? meta?.image ?? null,
      basePrice: existingPrice,
      price: finalPrice,
      selectedPromotion: promotion,
      discountValue,
    };
  } else {
    const basePrice = Number(price) || 0;
    const promotion = meta?.selectedPromotion ?? null;
    const { finalPrice, discountValue } = getPromotionPriceAdjustment(basePrice, promotion);

    next = [
      ...list,
      {
        product_variant_id: productVariantId,
        quantity,
        productName: productName ?? null,
        price: finalPrice,
        basePrice,
        size: meta?.size ?? null,
        thickness: meta?.thickness ?? null,
        variantLabel: meta?.variantLabel ?? null,
        image: meta?.image ?? null,
        selectedPromotion: promotion,
        discountValue,
      },
    ];
  }

  setSessionCart(next);
  toast.success(
    `${productName ?? productVariantId} đã thêm ${quantity} vào giỏ hàng!`,
  );
  window.dispatchEvent(new Event("cartUpdated"));
  return true;
};
