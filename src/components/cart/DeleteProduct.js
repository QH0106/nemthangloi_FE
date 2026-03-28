import { toast } from "react-toastify";
import { clearCartApi, removeCartItemApi } from "@/api/cart.api";
import { useCart } from "@/context/CartContext";
import { setSessionCart } from "@/components/cart/AddToCart";

export const DeleteProduct = () => {
  const { removeItem } = useCart();

  const deleteProduct = async (orderItemId, productname) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (!confirmDelete) return;

    const isSessionItem = typeof orderItemId === "string" && orderItemId.startsWith("session_");
    if (isSessionItem) {
      removeItem(orderItemId);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`Đã xóa ${productname} khỏi giỏ hàng!`);
      return;
    }

    try {
      await removeCartItemApi(orderItemId, { _skipAuthLogout: true });
      removeItem(orderItemId);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`Đã xóa ${productname} khỏi giỏ hàng!`);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        toast.error("Không thể xóa sản phẩm trên server. Vui lòng đăng nhập lại.");
        return;
      }

      if (status === 404) {
        toast.error("Không tìm thấy sản phẩm trong giỏ.");
      } else {
        toast.error("Lỗi server.");
      }
      console.error("Error:", error);
    }
  };
  return { deleteProduct };
};
export const DeleteAllProduct = () => {
  const { setItems } = useCart();
  const deleteAllProduct = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?");
    if (!confirmDelete) return;

    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      const isLoggedIn = Boolean(user?.user_id ?? user?.id ?? user?.email ?? null);
      const orderId = isLoggedIn ? user?.order_id || null : null;
      if (orderId) {
        await clearCartApi(orderId, { _skipAuthLogout: true });
      }
      setSessionCart([]);
      setItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        toast.error("Không thể xóa giỏ hàng trên server. Vui lòng đăng nhập lại.");
        return;
      }

      setSessionCart([]);
      setItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      if (status === 404) {
        toast.error("Không tìm thấy giỏ hàng.");
      } else {
        toast.error("Lỗi server.");
      }
      console.error("Error:", error);
    }
  };
  return { deleteAllProduct };
};
