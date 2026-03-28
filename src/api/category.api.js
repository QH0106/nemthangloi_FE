import axiosClient from "./axiosClient";

function normalizeCategoriesList(data) {
  if (Array.isArray(data)) return data;
  if (data?.data?.categories) return data.data.categories;
  if (data?.categories) return data.categories;
  return [];
}

export const getCategoriesApi = async () => {
  try {
    const res = await axiosClient.get("/api/categories");
    const raw = res?.data;
    return normalizeCategoriesList(raw) ?? [];
  } catch (err) {
    console.error("[getCategoriesApi]", err?.response?.status, err?.message, err?.response?.data);
    return [];
  }
};
