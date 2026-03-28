import { useMemo, useState } from "react";

const DEFAULT_PER_PAGE = 12;

export function useProductsListing(
  products,
  options = {}
) {
  const perPage = options?.perPage ?? DEFAULT_PER_PAGE;
  const initialSort = options?.initialSort ?? "az";
  const initialPrice = options?.initialPrice ?? [0, 20_000_000];

  const [sort, setSortState] = useState(initialSort);
  const [price, setPriceState] = useState(initialPrice);
  const [page, setPageState] = useState(1);

  const SORTERS = {
    az: (a, b) => a.name.localeCompare(b.name),
    za: (a, b) => b.name.localeCompare(a.name),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };

  const filtered = useMemo(() => {
    const [min, max] = price;
    return products
      .filter((p) => p.price >= min && p.price <= max)
      .slice()
      .sort(SORTERS[sort]);
  }, [products, price, sort]);

  const totalPages = useMemo(() => {
    const n = Math.ceil(filtered.length / perPage);
    return Math.max(1, n);
  }, [filtered.length, perPage]);

  const safePage = useMemo(() => {
    return Math.min(Math.max(page, 1), totalPages);
  }, [page, totalPages]);

  const items = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, perPage, safePage]);

  const setSort = (next) => {
    setSortState(next);
    setPageState(1);
  };

  const setPrice = (next) => {
    setPriceState(next);
    setPageState(1);
  };

  const setPage = (next) => {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    setPageState(clamped);
  };

  return {
    sort,
    price,
    page: safePage,
    totalPages,
    totalItems: filtered.length,
    items,
    setSort,
    setPrice,
    setPage,
  };
}

