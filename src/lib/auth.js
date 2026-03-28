import { setSessionCart } from "@/components/cart/AddToCart";

export function extractUserFromResponse(payload) {
    return payload?.user ?? payload?.data?.user ?? null;
}

export function getRoleFromUser(user) {
    if (!user) return "user";

    const rawRole =
        user.role ??
        user.user_role ??
        user.accountRole ??
        user.type ??
        null;

    if (typeof rawRole === "string") {
        return rawRole.toLowerCase() === "admin" ? "admin" : "user";
    }

    if (rawRole && typeof rawRole === "object") {
        const name = rawRole.name ?? rawRole.code ?? rawRole.role;
        if (typeof name === "string" && name.toLowerCase() === "admin") {
            return "admin";
        }
    }

    if (user.isAdmin === true || user.is_admin === true) {
        return "admin";
    }

    return "user";
}

export function saveAuthSession(user) {
    if (!user) return;

    localStorage.setItem("currentUser", JSON.stringify(user));

    const role = getRoleFromUser(user);
    if (role === "admin") {
        localStorage.setItem("admin_logged_in", "1");
        localStorage.setItem("admin_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_user");
    }

    window.dispatchEvent(new Event("userUpdated"));
}

export function clearAuthSession() {
    setSessionCart([]);
    localStorage.removeItem("guest_order_id");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_user");
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("userUpdated"));
}
