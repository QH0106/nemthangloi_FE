import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCart, getMyPendingCartApi, updateOrderApi } from "@/api/cart.api";
import {
  getPromotionPriceAdjustment,
  getPromotionSelectionByVariantId,
  getSessionCart,
  setSessionCart,
} from "@/components/cart/AddToCart";

const GUEST_ORDER_ID_KEY = "guest_order_id";
const CartContext = createContext(undefined);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};

const isLoggedInUser = (user) =>
  Boolean(user?.user_id ?? user?.id ?? user?.email ?? null);

const setStoredUser = (nextUser) => {
  localStorage.setItem("currentUser", JSON.stringify(nextUser));
  window.dispatchEvent(new Event("userUpdated"));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const getImageFromVariant = (item) => {
    const images = item?.ProductVariant?.Product?.ProductImages;
    if (!Array.isArray(images) || images.length === 0) return null;

    const main = images.find((img) => img?.is_main);
    return main?.url || images[0]?.url || null;
  };

  const mapOrderItems = (orderItems = []) =>
    orderItems.map((item) => {
      const productName = item?.ProductVariant?.Product?.name;
      const size = item?.ProductVariant?.size ?? null;
      const thickness = item?.ProductVariant?.thickness ?? null;
      const variantLabel =
        size && thickness ? `${size} - ${thickness}` : null;

      const basePrice = Number(item.price ?? item?.ProductVariant?.price ?? 0);
      const selectedPromotion = getPromotionSelectionByVariantId(item.product_variant_id);
      const { finalPrice, discountValue } = getPromotionPriceAdjustment(basePrice, selectedPromotion);

      return {
      id: item.order_item_id,
      order_item_id: item.order_item_id,
      order_id: item.order_id,
      product_variant_id: item.product_variant_id,
      quantity: Number(item.quantity) || 1,
      price: finalPrice,
      unitPrice: finalPrice,
      basePrice,
      discountValue,
      selectedPromotion,
      size,
      thickness,
      variantLabel,
      name: productName
        ? `${productName}${variantLabel ? ` - ${variantLabel}` : ""}`
        : variantLabel
          ? `Biến thể ${variantLabel}`
          : `Biến thể #${item.product_variant_id}`,
      image: getImageFromVariant(item) || "/no-image.png",
      selected: true,
      };
    });

  const mapSessionToItems = (sessionList) =>
    sessionList.map((s) => {
      const basePrice = Number(s.basePrice ?? s.price) || 0;
      const selectedPromotion = s.selectedPromotion || getPromotionSelectionByVariantId(s.product_variant_id);
      const { finalPrice, discountValue } = getPromotionPriceAdjustment(basePrice, selectedPromotion);

      return {
      id: `session_${s.product_variant_id}`,
      order_item_id: null,
      product_variant_id: s.product_variant_id,
      quantity: Number(s.quantity) || 1,
      price: finalPrice,
      unitPrice: finalPrice,
      basePrice,
      discountValue,
      selectedPromotion,
      size: s.size ?? null,
      thickness: s.thickness ?? null,
      variantLabel: s.variantLabel ?? null,
      name: s.productName || `Biến thể #${s.product_variant_id}`,
      image: s.image || "/no-image.png",
      selected: true,
      };
    });

  const refreshCart = async () => {
    try {
      const user = getStoredUser();
      const loggedIn = isLoggedInUser(user);
      const orderId = loggedIn ? user?.order_id || null : null;

      let apiItems = [];
      let serverCart = null;
      if (orderId) {
        try {
          serverCart = await getCart(orderId, { _skipAuthLogout: true });
          if (serverCart?.status !== "pending") {
            serverCart = null;
          }
        } catch {
          // Fallback below will attempt lookup by authenticated user.
        }
      }

      if (loggedIn && !serverCart) {
        try {
          serverCart = await getMyPendingCartApi({ _skipAuthLogout: true });
        } catch {
          serverCart = null;
        }
      }

      if (loggedIn && serverCart?.order_id) {
        const latestUser = getStoredUser();
        if (
          isLoggedInUser(latestUser) &&
          String(latestUser?.order_id || "") !== String(serverCart.order_id)
        ) {
          setStoredUser({ ...latestUser, order_id: serverCart.order_id });
        }
      } else if (loggedIn) {
        const latestUser = getStoredUser();
        if (isLoggedInUser(latestUser) && latestUser?.order_id) {
          const { order_id, ...rest } = latestUser;
          setStoredUser(rest);
        }
      }

      apiItems = mapOrderItems(serverCart?.OrderItems || []);

      const sessionList = getSessionCart();
      const sessionItems = mapSessionToItems(sessionList);

      // Logged-in cart should reflect server state only.
      setItems(loggedIn ? apiItems : sessionItems);
    } catch (error) {
      console.error("[CartContext] Fetch cart error:", error);

      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        const user = getStoredUser();
        if (isLoggedInUser(user) && user?.order_id) {
          try {
            const { order_id, ...rest } = user;
            localStorage.setItem("currentUser", JSON.stringify(rest));
            window.dispatchEvent(new Event("userUpdated"));
          } catch {
            // ignore
          }
        }
      }

      const sessionList = getSessionCart();
      setItems(mapSessionToItems(sessionList));
    }
  };

  useEffect(() => {
    refreshCart();
    const onCartUpdated = () => refreshCart();
    const onUserUpdated = () => refreshCart();
    const onStorage = (event) => {
      if (!event || event.key === "currentUser") {
        refreshCart();
      }
    };

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("userUpdated", onUserUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("userUpdated", onUserUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;

    const isSessionId = typeof id === "string" && id.startsWith("session_");
    if (isSessionId) {
      const pvId = id.replace(/^session_/, "");
      const sessionList = getSessionCart().map((s) =>
        String(s.product_variant_id) === String(pvId) ? { ...s, quantity: qty } : s
      );
      setSessionCart(sessionList);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
      return;
    }

    try {
      const user = getStoredUser();
      const targetItem = items.find((item) => item.id === id);
      const orderId = isLoggedInUser(user)
        ? targetItem?.order_id || user?.order_id || null
        : null;

      if (!orderId) {
        toast.error("Không xác định được giỏ hàng để cập nhật.");
        return;
      }

      await updateOrderApi(
        orderId,
        {
          items: [{ order_item_id: id, quantity: qty }],
        },
        { _skipAuthLogout: true },
      );

      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
    } catch (error) {
      console.error("[CartContext] Update quantity error:", error);
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Bạn không có quyền cập nhật giỏ hàng này.");
      } else {
        toast.error("Cập nhật số lượng thất bại. Vui lòng thử lại.");
      }
    }
  };

  const toggleSelect = (id, selected) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected } : i)));
  };

  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists)
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      return [...prev, item];
    });
  };

  const removeItem = (id) => {
    const isSessionId = typeof id === "string" && id.startsWith("session_");
    if (isSessionId) {
      const pvId = id.replace(/^session_/, "");
      const sessionList = getSessionCart().filter(
        (s) => String(s.product_variant_id) !== String(pvId)
      );
      setSessionCart(sessionList);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        updateQuantity,
        toggleSelect,
        addItem,
        removeItem,
        totalCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { GUEST_ORDER_ID_KEY };
