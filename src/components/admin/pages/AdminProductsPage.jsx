import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  createImageAdminApi,
  createProductBundleAdminApi,
  createPromotionAdminApi,
  createVariantAdminApi,
  deleteImageAdminApi,
  deleteProductAdminApi,
  deletePromotionAdminApi,
  deleteVariantAdminApi,
  listCategoriesAdminApi,
  listProductsAdminApi,
  uploadImagesAdminApi,
  updateImageAdminApi,
  updatePromotionAdminApi,
  updateProductAdminApi,
  updateVariantAdminApi,
} from "@/api/admin.api";

const createEmptyPromotion = () => ({
  promotion_id: "",
  promotion_type: "",
  discount_amount: "",
  discount_percent: "",
  gift_title: "",
});

const createEmptyVariant = () => ({
  variant_id: "",
  size: "",
  thickness: "",
  color: "",
  price: "",
  price_original: "",
  stock_qty: "",
  promotions: [createEmptyPromotion()],
});

const createInitialForm = () => ({
  id: "",
  name: "",
  sku: "",
  description: "",
  brand: "",
  origin: "",
  warranty_years: "",
  category_ids: [],
  main_image_url: "",
  extra_image_urls: "",
  variants: [createEmptyVariant()],
});

const SIZE_OPTIONS = ["100x200", "120x200", "140x200", "160x200", "180x200"];
const THICKNESS_OPTIONS = ["5cm", "10cm", "15cm"];

const S = {
  page: { background: "#0b0f19" },
  card: { background: "#111827", border: "1px solid #1e293b", borderRadius: 16 },
  thead: { background: "#0f172a" },
  theadCell: { color: "#64748b", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #1e293b" },
  bodyCell: { color: "#cbd5e1", borderBottom: "1px solid #1e293b" },
};

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(createInitialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeItem, setActiveItem] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const notify = (type, text) => setMessage({ type, text });

  const load = async () => {
    try {
      setLoading(true);
      const [res, categoriesRes] = await Promise.all([
        listProductsAdminApi({ page: 1, limit: 100 }),
        listCategoriesAdminApi({ page: 1, limit: 100 }),
      ]);
      setItems(Array.isArray(res?.products) ? res.products : []);
      setCategories(Array.isArray(categoriesRes?.categories) ? categoriesRes.categories : []);
      setSelected([]);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Không tải được products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const parseCategoryIds = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item));
    }

    return String(value || "")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
  };

  const payload = {
    name: form.name,
    sku: form.sku || undefined,
    description: form.description || undefined,
    brand: form.brand || undefined,
    origin: form.origin || undefined,
    warranty_years: form.warranty_years ? Number(form.warranty_years) : undefined,
    category_ids: parseCategoryIds(form.category_ids),
  };

  const buildBundlePayload = () => {
    const product = {
      ...payload,
      category_ids: parseCategoryIds(form.category_ids),
    };

    const images = [];
    if (form.main_image_url.trim()) {
      images.push({ url: form.main_image_url.trim(), is_main: true });
    }

    const extraImages = form.extra_image_urls
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((url) => url !== form.main_image_url.trim());

    extraImages.forEach((url) => {
      images.push({ url, is_main: false });
    });

    const variants = (form.variants || [])
      .map((variant, variantIndex) => {
        const variantTouched = [
          variant.size,
          variant.thickness,
          variant.color,
          variant.price,
          variant.price_original,
          variant.stock_qty,
          ...(variant.promotions || []).flatMap((promotion) => [
            promotion.promotion_type,
            promotion.discount_amount,
            promotion.discount_percent,
            promotion.gift_title,
          ]),
        ].some((value) => String(value || "").trim());

        if (!variantTouched) return null;

        if (!String(variant.price || "").trim()) {
          throw new Error(`Biến thể ${variantIndex + 1} bắt buộc có giá bán.`);
        }

        const promotions = (variant.promotions || [])
          .map((promotion, promotionIndex) => {
            const promotionTouched = [
              promotion.promotion_type,
              promotion.discount_amount,
              promotion.discount_percent,
              promotion.gift_title,
            ].some((value) => String(value || "").trim());

            if (!promotionTouched) return null;

            if (!promotion.promotion_type) {
              throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} chưa chọn loại.`);
            }

            if (promotion.promotion_type === "discount_amount") {
              if (!String(promotion.discount_amount || "").trim()) {
                throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần số tiền giảm.`);
              }

              return {
                promotion_type: "discount_amount",
                discount_amount: Number(promotion.discount_amount),
              };
            }

            if (promotion.promotion_type === "discount_percent") {
              if (!String(promotion.discount_percent || "").trim()) {
                throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần phần trăm giảm.`);
              }

              return {
                promotion_type: "discount_percent",
                discount_percent: Number(promotion.discount_percent),
              };
            }

            if (!String(promotion.gift_title || "").trim()) {
              throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần tên quà tặng.`);
            }

            return {
              promotion_type: "gift",
              gift_title: promotion.gift_title.trim(),
            };
          })
          .filter(Boolean);

        return {
          size: variant.size || undefined,
          thickness: variant.thickness || undefined,
          color: variant.color || undefined,
          price: Number(variant.price),
          price_original: variant.price_original ? Number(variant.price_original) : undefined,
          stock_qty: variant.stock_qty ? Number(variant.stock_qty) : 0,
          promotions,
        };
      })
      .filter(Boolean);

    return { product, images, variants };
  };

  const onCreate = async () => {
    if (!form.name) {
      notify("error", "Tên sản phẩm là bắt buộc.");
      return;
    }
    try {
      setLoading(true);
      await createProductBundleAdminApi(buildBundlePayload());
      setForm(createInitialForm());
      await load();
      notify("success", "Tạo sản phẩm thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || err?.message || "Tạo sản phẩm thất bại");
    } finally { setLoading(false); }
  };

  const onUpdate = async () => {
    if (!form.id) { notify("error", "Nhập ID để cập nhật."); return; }
    try {
      setLoading(true);
      await updateProductAdminApi(Number(form.id), payload);

      const mainImageUrl = form.main_image_url.trim();
      const extraImages = form.extra_image_urls
        .split(/\r?\n|,/) 
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((url) => url !== mainImageUrl);

      const nextImages = [
        ...(mainImageUrl ? [{ url: mainImageUrl, is_main: true }] : []),
        ...extraImages.map((url) => ({ url, is_main: false })),
      ];

      const currentImages = activeItem?.ProductImages || [];
      const nextImagesByUrl = new Map(nextImages.map((image) => [image.url, image]));
      const currentImagesByUrl = new Map(currentImages.map((image) => [image.url, image]));

      for (const image of currentImages) {
        const nextImage = nextImagesByUrl.get(image.url);

        if (!nextImage) {
          await deleteImageAdminApi(image.image_id);
          continue;
        }

        if (Boolean(image.is_main) !== nextImage.is_main) {
          await updateImageAdminApi(image.image_id, {
            url: image.url,
            is_main: nextImage.is_main,
          });
        }
      }

      for (const image of nextImages) {
        if (currentImagesByUrl.has(image.url)) continue;

        await createImageAdminApi({
          product_id: Number(form.id),
          url: image.url,
          is_main: image.is_main,
        });
      }

      const currentVariants = activeItem?.ProductVariants || [];
      const submittedVariantIds = [];

      for (let variantIndex = 0; variantIndex < (form.variants || []).length; variantIndex += 1) {
        const variant = form.variants[variantIndex];
        const variantTouched = [
          variant.size,
          variant.thickness,
          variant.color,
          variant.price,
          variant.price_original,
          variant.stock_qty,
          ...(variant.promotions || []).flatMap((promotion) => [
            promotion.promotion_type,
            promotion.discount_amount,
            promotion.discount_percent,
            promotion.gift_title,
          ]),
        ].some((value) => String(value || "").trim());

        if (!variantTouched) continue;

        if (!String(variant.price || "").trim()) {
          throw new Error(`Biến thể ${variantIndex + 1} bắt buộc có giá bán.`);
        }

        const variantPayload = {
          size: variant.size || undefined,
          thickness: variant.thickness || undefined,
          color: variant.color || undefined,
          price: Number(variant.price),
          price_original: variant.price_original ? Number(variant.price_original) : undefined,
          stock_qty: variant.stock_qty ? Number(variant.stock_qty) : 0,
        };

        let variantId = Number(variant.variant_id);

        if (Number.isFinite(variantId)) {
          await updateVariantAdminApi(variantId, variantPayload);
          submittedVariantIds.push(variantId);
        } else {
          const createdVariant = await createVariantAdminApi({
            product_id: Number(form.id),
            ...variantPayload,
          });

          variantId = Number(createdVariant?.variant_id);
          if (!Number.isFinite(variantId)) {
            throw new Error(`Không tạo được biến thể mới ở dòng ${variantIndex + 1}.`);
          }

          submittedVariantIds.push(variantId);
        }

        const currentVariant = currentVariants.find((item) => Number(item.variant_id) === variantId);
        const currentPromotions = currentVariant?.VariantPromotions || [];
        const submittedPromotionIds = [];

        for (let promotionIndex = 0; promotionIndex < (variant.promotions || []).length; promotionIndex += 1) {
          const promotion = variant.promotions[promotionIndex];
          const promotionTouched = [
            promotion.promotion_type,
            promotion.discount_amount,
            promotion.discount_percent,
            promotion.gift_title,
          ].some((value) => String(value || "").trim());

          if (!promotionTouched) continue;

          if (!promotion.promotion_type) {
            throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} chưa chọn loại.`);
          }

          let promotionPayload = null;

          if (promotion.promotion_type === "discount_amount") {
            if (!String(promotion.discount_amount || "").trim()) {
              throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần số tiền giảm.`);
            }

            promotionPayload = {
              variant_id: variantId,
              promotion_type: "discount_amount",
              discount_amount: Number(promotion.discount_amount),
            };
          } else if (promotion.promotion_type === "discount_percent") {
            if (!String(promotion.discount_percent || "").trim()) {
              throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần phần trăm giảm.`);
            }

            promotionPayload = {
              variant_id: variantId,
              promotion_type: "discount_percent",
              discount_percent: Number(promotion.discount_percent),
            };
          } else {
            if (!String(promotion.gift_title || "").trim()) {
              throw new Error(`Khuyến mãi ${promotionIndex + 1} của biến thể ${variantIndex + 1} cần tên quà tặng.`);
            }

            promotionPayload = {
              variant_id: variantId,
              promotion_type: "gift",
              gift_title: promotion.gift_title.trim(),
            };
          }

          const promotionId = Number(promotion.promotion_id);
          if (Number.isFinite(promotionId)) {
            await updatePromotionAdminApi(promotionId, promotionPayload);
            submittedPromotionIds.push(promotionId);
          } else {
            const createdPromotion = await createPromotionAdminApi(promotionPayload);
            const createdPromotionId = Number(createdPromotion?.promotion_id);
            if (Number.isFinite(createdPromotionId)) {
              submittedPromotionIds.push(createdPromotionId);
            }
          }
        }

        for (const promotion of currentPromotions) {
          const currentPromotionId = Number(promotion.promotion_id);
          if (!submittedPromotionIds.includes(currentPromotionId)) {
            await deletePromotionAdminApi(currentPromotionId);
          }
        }
      }

      for (const variant of currentVariants) {
        const currentVariantId = Number(variant.variant_id);
        if (!submittedVariantIds.includes(currentVariantId)) {
          await deleteVariantAdminApi(currentVariantId);
        }
      }

      await load();
      notify("success", "Cập nhật sản phẩm thành công.");
    } catch (err) {
      notify("error", err?.response?.data?.message || err?.message || "Cập nhật sản phẩm thất bại.");
    } finally { setLoading(false); }
  };

  const onDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProductAdminApi(id);
      await load();
      notify("success", "Đã xóa sản phẩm.");
    } catch (err) {
      notify("error", err?.response?.data?.message || "Xóa sản phẩm thất bại.");
    } finally { setLoading(false); }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) { setSelected(items.map((item) => item.product_id)); return; }
    setSelected([]);
  };

  const handleSelectOne = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const visibleRows = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const updateVariantField = (variantIndex, key, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) => (
        index === variantIndex ? { ...variant, [key]: value } : variant
      )),
    }));
  };

  const updatePromotionField = (variantIndex, promotionIndex, key, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) => {
        if (index !== variantIndex) return variant;

        return {
          ...variant,
          promotions: variant.promotions.map((promotion, innerIndex) => {
            if (innerIndex !== promotionIndex) return promotion;

            if (key === "promotion_type") {
              return {
                ...promotion,
                promotion_type: value,
                discount_amount: "",
                discount_percent: "",
                gift_title: "",
              };
            }

            return { ...promotion, [key]: value };
          }),
        };
      }),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (variantIndex) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.length === 1
        ? [createEmptyVariant()]
        : prev.variants.filter((_, index) => index !== variantIndex),
    }));
  };

  const addPromotion = (variantIndex) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) => (
        index === variantIndex
          ? { ...variant, promotions: [...variant.promotions, createEmptyPromotion()] }
          : variant
      )),
    }));
  };

  const removePromotion = (variantIndex, promotionIndex) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) => {
        if (index !== variantIndex) return variant;

        return {
          ...variant,
          promotions: variant.promotions.length === 1
            ? [createEmptyPromotion()]
            : variant.promotions.filter((_, innerIndex) => innerIndex !== promotionIndex),
        };
      }),
    }));
  };

  const extractUploadedUrls = (uploadedFiles = []) => (
    uploadedFiles
      .map((file) => (typeof file === "string" ? file : file?.url))
      .filter(Boolean)
  );

  const uploadAndApplyImages = async (files, target = "main") => {
    if (!files?.length) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      const uploadedFiles = await uploadImagesAdminApi(formData);
      const uploadedUrls = extractUploadedUrls(uploadedFiles);

      if (!uploadedUrls.length) {
        notify("error", "Upload ảnh thất bại.");
        return;
      }

      if (target === "main") {
        setForm((prev) => ({ ...prev, main_image_url: uploadedUrls[0] }));
        notify("success", "Đã upload ảnh chính.");
        return;
      }

      setForm((prev) => {
        const existingUrls = prev.extra_image_urls
          .split(/\r?\n|,/) 
          .map((item) => item.trim())
          .filter(Boolean);

        const mergedUrls = Array.from(new Set([...existingUrls, ...uploadedUrls]));
        return {
          ...prev,
          extra_image_urls: mergedUrls.join("\n"),
        };
      });

      notify("success", `Đã upload ${uploadedUrls.length} ảnh phụ.`);
    } catch (err) {
      notify("error", err?.response?.data?.message || "Upload ảnh thất bại.");
    } finally {
      setUploadingImages(false);
    }
  };

  const openCreateModal = () => { setForm(createInitialForm()); setActiveItem(null); setModalMode("create"); setModalOpen(true); };
  const openViewModal = (item) => { setActiveItem(item); setModalMode("view"); setModalOpen(true); };
  const openEditModal = (item) => {
    setActiveItem(item);
    const productImages = item.ProductImages || [];
    const mainImage = productImages.find((image) => Boolean(image.is_main)) || productImages[0];
    const extraImageUrls = productImages
      .filter((image) => image.url && image.url !== mainImage?.url)
      .map((image) => image.url)
      .join("\n");

    setForm({
      ...createInitialForm(),
      id: String(item.product_id || ""),
      name: item.name || "",
      sku: item.sku || "",
      description: item.description || "",
      brand: item.brand || "",
      origin: item.origin || "",
      warranty_years: String(item.warranty_years ?? ""),
      category_ids: (item.Categories || []).map((category) => Number(category.category_id)),
      main_image_url: mainImage?.url || "",
      extra_image_urls: extraImageUrls,
      variants: (item.ProductVariants || []).length > 0
        ? item.ProductVariants.map((variant) => ({
            ...createEmptyVariant(),
            variant_id: variant.variant_id,
            size: variant.size || "",
            thickness: variant.thickness || "",
            color: variant.color || "",
            price: variant.price != null ? String(variant.price) : "",
            price_original: variant.price_original != null ? String(variant.price_original) : "",
            stock_qty: variant.stock_qty != null ? String(variant.stock_qty) : "",
            promotions: (variant.VariantPromotions || []).length > 0
              ? variant.VariantPromotions.map((promotion) => ({
                  promotion_id: promotion.promotion_id,
                  promotion_type: promotion.promotion_type || "",
                  discount_amount: promotion.discount_amount != null ? String(promotion.discount_amount) : "",
                  discount_percent: promotion.discount_percent != null ? String(promotion.discount_percent) : "",
                  gift_title: promotion.gift_title || "",
                }))
              : [createEmptyPromotion()],
          }))
        : [createEmptyVariant()],
    });
    setModalMode("edit");
    setModalOpen(true);
  };
  const openDeleteModal = (item) => { setActiveItem(item); setModalMode("delete"); setModalOpen(true); };
  const closeModal = () => { if (loading) return; setModalOpen(false); };

  const submitModal = async () => {
    if (modalMode === "create") { await onCreate(); setModalOpen(false); return; }
    if (modalMode === "edit") { await onUpdate(); setModalOpen(false); return; }
    if (modalMode === "delete" && activeItem?.product_id) { await onDelete(activeItem.product_id); setModalOpen(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#f1f5f9" }}>
            Quản lý Sản phẩm
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            {items.length} sản phẩm đang có trong hệ thống
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            disabled={loading}
            size="small"
            sx={{ borderColor: "#334155", color: "#94a3b8", "&:hover": { borderColor: "#6366f1", color: "#6366f1" }, textTransform: "none" }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            size="small"
            sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, textTransform: "none" }}
          >
            Thêm mới
          </Button>
        </Stack>
      </div>

      {message.text ? <Alert severity={message.type} onClose={() => setMessage({ type: "", text: "" })}>{message.text}</Alert> : null}

      {/* Table card */}
      <div style={S.card}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4">
          <Typography variant="subtitle2" sx={{ color: selected.length > 0 ? "#f87171" : "#94a3b8", fontWeight: 600 }}>
            {selected.length > 0 ? `Đã chọn ${selected.length} sản phẩm` : "Danh sách sản phẩm"}
          </Typography>
          {selected.length > 0 && (
            <Tooltip title="Xóa đã chọn">
              <IconButton size="small" sx={{ color: "#f87171" }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <TableContainer>
          <Table size="small">
            <TableHead sx={S.thead}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ ...S.theadCell, pl: 2 }}>
                  <Checkbox
                    size="small"
                    sx={{ color: "#475569" }}
                    indeterminate={selected.length > 0 && selected.length < items.length}
                    checked={items.length > 0 && selected.length === items.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell sx={S.theadCell}>ID</TableCell>
                <TableCell sx={S.theadCell}>Tên sản phẩm</TableCell>
                <TableCell sx={S.theadCell}>SKU</TableCell>
                <TableCell sx={S.theadCell}>Brand</TableCell>
                <TableCell sx={S.theadCell}>Origin</TableCell>
                <TableCell sx={S.theadCell}>Bảo hành</TableCell>
                <TableCell align="right" sx={{ ...S.theadCell, pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((item) => {
                const isSelected = selected.includes(item.product_id);
                return (
                  <TableRow
                    key={item.product_id}
                    selected={isSelected}
                    sx={{
                      "&:hover": { background: "#1e293b" },
                      "&.Mui-selected": { background: "#1e2840" },
                      "&.Mui-selected:hover": { background: "#1e3050" },
                    }}
                  >
                    <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: "1px solid #1e293b" }}>
                      <Checkbox
                        size="small"
                        sx={{ color: "#475569" }}
                        checked={isSelected}
                        onChange={() => handleSelectOne(item.product_id)}
                      />
                    </TableCell>
                    <TableCell sx={{ ...S.bodyCell, color: "#6366f1", fontWeight: 600 }}>{item.product_id}</TableCell>
                    <TableCell sx={{ ...S.bodyCell, color: "#f1f5f9", fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell sx={S.bodyCell}>{item.sku || <span style={{ color: "#475569" }}>—</span>}</TableCell>
                    <TableCell sx={S.bodyCell}>{item.brand || <span style={{ color: "#475569" }}>—</span>}</TableCell>
                    <TableCell sx={S.bodyCell}>{item.origin || <span style={{ color: "#475569" }}>—</span>}</TableCell>
                    <TableCell sx={S.bodyCell}>{item.warranty_years != null ? `${item.warranty_years} năm` : <span style={{ color: "#475569" }}>—</span>}</TableCell>
                    <TableCell align="right" sx={{ borderBottom: "1px solid #1e293b", pr: 2 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" sx={{ color: "#fbbf24", "&:hover": { background: "rgba(251,191,36,0.1)" } }} onClick={() => openEditModal(item)}>
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chi tiết">
                          <IconButton size="small" sx={{ color: "#60a5fa", "&:hover": { background: "rgba(96,165,250,0.1)" } }} onClick={() => openViewModal(item)}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" sx={{ color: "#f87171", "&:hover": { background: "rgba(248,113,113,0.1)" } }} onClick={() => openDeleteModal(item)}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#475569", borderBottom: "none" }}>
                    {loading ? "Đang tải..." : "Không có dữ liệu."}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ color: "#64748b", borderTop: "1px solid #1e293b", "& .MuiTablePagination-select": { color: "#94a3b8" }, "& .MuiTablePagination-selectIcon": { color: "#64748b" }, "& .MuiIconButton-root": { color: "#64748b" }, "& .Mui-disabled": { color: "#334155 !important" } }}
        />
      </div>

      {/* Dialog */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { background: "#111827", border: "1px solid #1e293b", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, borderBottom: "1px solid #1e293b", pb: 2 }}>
          {modalMode === "create" && "Tạo sản phẩm mới"}
          {modalMode === "edit" && "Chỉnh sửa sản phẩm"}
          {modalMode === "view" && "Chi tiết sản phẩm"}
          {modalMode === "delete" && "Xác nhận xóa"}
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {modalMode === "view" && (
            <Stack spacing={2} mt={0.5}>
              <div className="grid grid-cols-2 gap-3 rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                {[
                  ["ID", activeItem?.product_id],
                  ["Tên", activeItem?.name],
                  ["SKU", activeItem?.sku],
                  ["Mô tả", activeItem?.description],
                  ["Thương hiệu", activeItem?.brand],
                  ["Xuất xứ", activeItem?.origin],
                  ["Bảo hành", activeItem?.warranty_years != null ? `${activeItem.warranty_years} năm` : null],
                ].map(([label, value]) => (
                  <div key={label}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 500 }}>{value || "—"}</Typography>
                  </div>
                ))}
              </div>

              {(activeItem?.Categories || []).length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1.5 }}>Danh Mục</Typography>
                  <Stack spacing={0.5}>
                    {(activeItem.Categories || []).map((cat) => (
                      <Typography key={cat.category_id} variant="body2" sx={{ color: "#cbd5e1" }}>
                        #{cat.category_id} · {cat.name}
                      </Typography>
                    ))}
                  </Stack>
                </div>
              )}

              {(activeItem?.ProductVariants || []).length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1.5 }}>Biến thể</Typography>
                  <Stack spacing={1.5}>
                    {(activeItem.ProductVariants || []).map((v) => (
                      <div key={v.variant_id} className="rounded-lg px-3 py-2" style={{ background: "#131929", border: "1px solid #1e293b" }}>
                        <Typography variant="body2" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                          #{v.variant_id} · {[v.size, v.thickness, v.color].filter(Boolean).join(" / ") || "—"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          Giá: {v.price || "—"} · Giá gốc: {v.price_original || "—"} · Hàng tồn: {v.stock_qty ?? "—"}
                        </Typography>
                        {(v.VariantPromotions || []).length > 0 && (
                          <Stack spacing={0.5} mt={1}>
                            {(v.VariantPromotions || []).map((promotion) => (
                              <Typography key={promotion.promotion_id} variant="caption" sx={{ color: "#cbd5e1" }}>
                                • {promotion.promotion_type === "discount_amount" && `Giảm ${promotion.discount_amount || 0}`}
                                {promotion.promotion_type === "discount_percent" && `Giảm ${promotion.discount_percent || 0}%`}
                                {promotion.promotion_type === "gift" && `Quà tặng: ${promotion.gift_title || "—"}`}
                              </Typography>
                            ))}
                          </Stack>
                        )}
                      </div>
                    ))}
                  </Stack>
                </div>
              )}
            </Stack>
          )}

          {modalMode === "delete" && (
            <div className="mt-2 rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #7f1d1d" }}>
              <Typography variant="body2" sx={{ color: "#fca5a5" }}>
                Bạn có chắc muốn xóa sản phẩm <strong>#{activeItem?.product_id} -  {activeItem?.name}</strong>? Hành động này không thể hoàn tác.
              </Typography>
            </div>
          )}

          {(modalMode === "create" || modalMode === "edit") && (
            <div className="mt-1 space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {modalMode === "edit" && (
                <TextField size="small" label="ID" value={form.id} disabled
                  sx={{ "& .MuiInputBase-root": { color: "#94a3b8", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                />
              )}
              {[
                ["name", "Tên sản phẩm *"],
                ["sku", "SKU"],
                ["brand", "Thương hiệu"],
                ["origin", "Xuất xứ"],
                ["warranty_years", "Bảo hành (năm)"],
              ].map(([key, lbl]) => (
                <TextField
                  key={key}
                  size="small"
                  label={lbl}
                  value={form[key]}
                  onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))}
                  sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" }, "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" } }}
                />
              ))}

              <TextField
                select
                size="small"
              
                value={form.category_ids}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  category_ids: typeof e.target.value === "string"
                    ? e.target.value.split(",").map((item) => Number(item)).filter((item) => Number.isFinite(item))
                    : e.target.value,
                }))}
                SelectProps={{
                  multiple: true,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected?.length) return "Chọn danh mục";
                    return categories
                      .filter((category) => selected.includes(category.category_id))
                      .map((category) => category.name)
                      .join(", ");
                  },
                }}
                sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" }, "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" } }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    <Checkbox size="small" checked={form.category_ids.includes(category.category_id)} />
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              </div>

              <TextField
                size="small"
                className="w-full mb-5!"
                label="Mô tả"
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
                sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" }, "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" } }}
              />

              {(modalMode === "create" || modalMode === "edit") && (
                <>
                  <div className="rounded-xl border p-4" style={{ borderColor: "#1e293b", background: "#0f172a" }}>
                    <Typography variant="subtitle2" sx={{ color: "#f1f5f9", mb: 2 }}>Hình ảnh sản phẩm</Typography>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <TextField
                          size="small"
                          label="URL ảnh chính"
                          value={form.main_image_url}
                          onChange={(e) => setForm((v) => ({ ...v, main_image_url: e.target.value }))}
                          sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#111827" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                          fullWidth
                        />
                        <Button
                          component="label"
                          size="small"
                          variant="outlined"
                          disabled={loading || uploadingImages}
                          sx={{ borderColor: "#334155", color: "#cbd5e1", textTransform: "none" }}
                        >
                          {uploadingImages ? "Đang upload..." : "Upload ảnh chính"}
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              await uploadAndApplyImages(e.target.files, "main");
                              e.target.value = "";
                            }}
                          />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <TextField
                          size="small"
                          label="URL ảnh phụ (mỗi dòng 1 URL hoặc ngăn cách bằng dấu phẩy)"
                          multiline
                          minRows={3}
                          value={form.extra_image_urls}
                          onChange={(e) => setForm((v) => ({ ...v, extra_image_urls: e.target.value }))}
                          sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#111827" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                          fullWidth
                        />
                        <Button
                          component="label"
                          size="small"
                          variant="outlined"
                          disabled={loading || uploadingImages}
                          sx={{ borderColor: "#334155", color: "#cbd5e1", textTransform: "none" }}
                        >
                          {uploadingImages ? "Đang upload..." : "Upload ảnh phụ"}
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              await uploadAndApplyImages(e.target.files, "extra");
                              e.target.value = "";
                            }}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4" style={{ borderColor: "#1e293b", background: "#0f172a" }}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Typography variant="subtitle2" sx={{ color: "#f1f5f9" }}>Biến thể sản phẩm</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addVariant}
                        sx={{ borderColor: "#334155", color: "#cbd5e1", textTransform: "none" }}
                      >
                        Thêm biến thể
                      </Button>
                    </div>

                    <Stack spacing={2}>
                      {(form.variants || []).map((variant, variantIndex) => (
                        <div key={`variant-${variant.variant_id || variantIndex}`} className="rounded-xl border p-4" style={{ borderColor: "#233047", background: "#111827" }}>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <Typography variant="subtitle2" sx={{ color: "#f1f5f9" }}>
                              Biến thể {variantIndex + 1}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeVariant(variantIndex)}
                              sx={{ color: "#f87171", background: "rgba(248,113,113,0.08)" }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <TextField
                              size="small"
                              label="Kích thước"
                              select
                              value={variant.size}
                              onChange={(e) => updateVariantField(variantIndex, "size", e.target.value)}
                              sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                            >
                              <MenuItem value="">Chọn kích thước</MenuItem>
                              {SIZE_OPTIONS.map((sizeOption) => (
                                <MenuItem key={sizeOption} value={sizeOption}>
                                  {sizeOption}
                                </MenuItem>
                              ))}
                            </TextField>

                            <TextField
                              size="small"
                              label="Độ dày"
                              select
                              value={variant.thickness}
                              onChange={(e) => updateVariantField(variantIndex, "thickness", e.target.value)}
                              sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                            >
                              <MenuItem value="">Chọn độ dày</MenuItem>
                              {THICKNESS_OPTIONS.map((thicknessOption) => (
                                <MenuItem key={thicknessOption} value={thicknessOption}>
                                  {thicknessOption}
                                </MenuItem>
                              ))}
                            </TextField>

                            {[
                              ["color", "Màu sắc"],
                              ["price", "Giá bán *"],
                              ["price_original", "Giá gốc"],
                              ["stock_qty", "Tồn kho"],
                            ].map(([key, lbl]) => (
                              <TextField
                                key={`${variantIndex}-${key}`}
                                size="small"
                                label={lbl}
                                value={variant[key]}
                                onChange={(e) => updateVariantField(variantIndex, key, e.target.value)}
                                sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                              />
                            ))}
                          </div>

                          <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "#1e293b", background: "#0f172a" }}>
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <Typography variant="subtitle2" sx={{ color: "#f1f5f9" }}>
                                Khuyến mãi của biến thể {variantIndex + 1}
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => addPromotion(variantIndex)}
                                sx={{ borderColor: "#334155", color: "#cbd5e1", textTransform: "none" }}
                              >
                                Thêm khuyến mãi
                              </Button>
                            </div>

                            <Stack spacing={2}>
                              {(variant.promotions || []).map((promotion, promotionIndex) => (
                                <div key={`variant-${variantIndex}-promotion-${promotionIndex}`} className="rounded-lg border p-3" style={{ borderColor: "#1e293b", background: "#111827" }}>
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <Typography variant="body2" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                                      Khuyến mãi {promotionIndex + 1}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => removePromotion(variantIndex, promotionIndex)}
                                      sx={{ color: "#f87171", background: "rgba(248,113,113,0.08)" }}
                                    >
                                      <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <TextField
                                      size="small"
                                      label="Loại khuyến mãi"
                                      select
                                      value={promotion.promotion_type}
                                      onChange={(e) => updatePromotionField(variantIndex, promotionIndex, "promotion_type", e.target.value)}
                                      sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                                    >
                                      <MenuItem value="">Không áp dụng</MenuItem>
                                      <MenuItem value="discount_amount">Giảm số tiền</MenuItem>
                                      <MenuItem value="discount_percent">Giảm phần trăm</MenuItem>
                                      <MenuItem value="gift">Quà tặng</MenuItem>
                                    </TextField>

                                    {promotion.promotion_type === "discount_amount" && (
                                      <TextField
                                        size="small"
                                        label="Số tiền giảm"
                                        value={promotion.discount_amount}
                                        onChange={(e) => updatePromotionField(variantIndex, promotionIndex, "discount_amount", e.target.value)}
                                        sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                                      />
                                    )}

                                    {promotion.promotion_type === "discount_percent" && (
                                      <TextField
                                        size="small"
                                        label="Phần trăm giảm"
                                        value={promotion.discount_percent}
                                        onChange={(e) => updatePromotionField(variantIndex, promotionIndex, "discount_percent", e.target.value)}
                                        sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                                      />
                                    )}

                                    {promotion.promotion_type === "gift" && (
                                      <TextField
                                        size="small"
                                        label="Tên quà tặng"
                                        value={promotion.gift_title}
                                        onChange={(e) => updatePromotionField(variantIndex, promotionIndex, "gift_title", e.target.value)}
                                        sx={{ "& .MuiInputBase-root": { color: "#f1f5f9", background: "#0f172a" }, "& .MuiInputLabel-root": { color: "#64748b" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" } }}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </Stack>
                          </div>
                        </div>
                      ))}
                    </Stack>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1e293b", px: 3, py: 2, gap: 1 }}>
          <Button onClick={closeModal} disabled={loading} sx={{ color: "#94a3b8", textTransform: "none" }}>
            Đóng
          </Button>
          {modalMode !== "view" && (
            <Button
              onClick={submitModal}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: modalMode === "delete" ? "#ef4444" : "#6366f1",
                "&:hover": { bgcolor: modalMode === "delete" ? "#dc2626" : "#4f46e5" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {modalMode === "create" && "Tạo sản phẩm mới"}
              {modalMode === "edit" && "Lưu thay đổi"}
              {modalMode === "delete" && "Xóa"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

