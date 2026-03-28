import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { pathToRegexp } from "path-to-regexp";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function makePath(path) {
  return pathToRegexp(path).regexp;
}

export function matchPath(pathname, pattern) {
  return pattern.test(pathname);
}

export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const generateOrderCode = () => {
  const prefix = "BEG-";
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${timestamp}${randomNum}`;
};

export function flyToCart(startEl, endEl) {
  const s = startEl.getBoundingClientRect();
  const e = endEl.getBoundingClientRect();

  const dot = document.createElement("div");
  dot.style.position = "fixed";
  dot.style.left = `${s.left + s.width / 2}px`;
  dot.style.top = `${s.top + s.height / 2}px`;
  dot.style.width = `12px`;
  dot.style.height = `12px`;
  dot.style.borderRadius = "50%";
  dot.style.background = "#FFC828";
  dot.style.zIndex = "10000";
  dot.style.pointerEvents = "none";
  document.body.appendChild(dot);

  const dx = e.left + e.width / 2 - (s.left + s.width / 2);
  const dy = e.top + e.height / 2 - (s.top + s.height / 2);

  const anim = dot.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(1.1)`,
        opacity: 0.9,
        offset: 0.6,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.5)`,
        opacity: 0.0,
        offset: 1,
      },
    ],
    { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" },
  );

  anim.onfinish = () => dot.remove();
}

export const mapProductToCard = (product) => {
  const mainImage = product.ProductImages?.find((img) => img.is_main);

  const hoverImage = product.ProductImages?.find((img) => !img.is_main);

  const variant = product.ProductVariants?.[0];
  const promotions = Array.isArray(variant?.VariantPromotions)
    ? variant.VariantPromotions
    : [];
  const giftPromotion = promotions.find((promotion) => promotion?.promotion_type === "gift");
  const selectedPromotion = giftPromotion || promotions[0] || null;

  const originalPrice = Number(variant?.price_original ?? variant?.price ?? 0);
  let finalPrice = Number(variant?.price ?? 0);
  let discountPercent =  Math.round(((originalPrice - finalPrice) / originalPrice) * 100) || 0;

  // if (selectedPromotion?.promotion_type === "discount_percent") {
  //   discountPercent = Number(selectedPromotion.discount_percent) || 0;
  //   finalPrice = Math.max(0, Math.round(originalPrice * (1 - discountPercent / 100)));
  // }

  // if (selectedPromotion?.promotion_type === "discount_amount") {
  //   const discountAmount = Math.max(0, Number(selectedPromotion.discount_amount) || 0);
  //   finalPrice = Math.max(0, Math.round(originalPrice - discountAmount));
  //   if (originalPrice > 0 && finalPrice < originalPrice) {
  //     discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  //   }
  // }

  return {
    id: product.product_id,
    variantId: variant?.variant_id,
    size: variant?.size ?? null,
    thickness: variant?.thickness ?? null,
    variantLabel:
      variant?.size && variant?.thickness
        ? `${variant.size} - ${variant.thickness}`
        : null,
    title: product.name,
    price: Math.round(finalPrice),
    originalPrice: discountPercent ? originalPrice : variant?.price_original ? Math.round(variant.price_original) : null,
    discountPercent,
    image: mainImage?.url ?? "/no-image.png",
    hoverImage: hoverImage?.url,
    selectedPromotion,
  };
};
