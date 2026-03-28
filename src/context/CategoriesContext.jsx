import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCategoriesApi } from "../api/category.api";
import { NAVBAR_ITEMS } from "../constants/common.constants";

const CategoriesContext = createContext(undefined);

const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        const cache = sessionStorage.getItem("categories");

        if (cache) {
          const parsed = JSON.parse(cache);
          if (mounted) setCategories(parsed);
          return;
        }

        const list = await getCategoriesApi();
        const normalized = Array.isArray(list) ? list : [];

        if (mounted) {
          setCategories(normalized);
          sessionStorage.setItem("categories", JSON.stringify(normalized));
        }
      } catch (err) {
        if (mounted) setCategories([]);
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const productChildren = useMemo(() => {
    return categories
      .map((c) => {
        const id = c.category_id ?? c.id;
        const name = c.name ?? "";

        const slug = c.slug ?? slugify(name) ?? String(id);

        return {
          key: slug || `category-${id}`,
          title: name,
          link: `/products/${slug}`,
        };
      })
      .filter((item) => item.title);
  }, [categories]);

  const navItems = useMemo(() => {
    return NAVBAR_ITEMS.map((item) =>
      item.key === "products"
        ? { ...item, children: productChildren }
        : item
    );
  }, [productChildren]);

  const value = useMemo(
    () => ({ categories, navItems }),
    [categories, navItems],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (ctx === undefined)
    throw new Error("useCategories must be used within CategoriesProvider");
  return ctx;
}
