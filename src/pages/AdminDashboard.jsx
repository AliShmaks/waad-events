import { useEffect, useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  LogOut,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import "./AdminDashboard.css";

const STORAGE_BUCKET = "category-images";
const MAX_SOURCE_IMAGE_SIZE = 30 * 1024 * 1024;
const COMPRESSED_MAX_SIZE_MB = 1.2;
const COMPRESSED_MAX_DIMENSION = 1920;


async function compressToWebP(file) {
  const compressedBlob = await imageCompression(file, {
    maxSizeMB: COMPRESSED_MAX_SIZE_MB,
    maxWidthOrHeight: COMPRESSED_MAX_DIMENSION,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });

  const baseName =
    file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-") ||
    "waad-image";

  return new File([compressedBlob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

function storagePathFromUrl(url) {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!url.includes(marker)) return null;

  return decodeURIComponent(url.split(marker)[1]);
}

function Field({ label, value, onChange, textarea = false, type = "text" }) {
  return (
    <label className="waad-field">
      <span>{label}</span>
      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [uploadingCategoryId, setUploadingCategoryId] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const imagesByCategory = useMemo(() => {
    const map = new Map();

    images.forEach((image) => {
      const current = map.get(image.category_id) || [];
      current.push(image);
      map.set(image.category_id, current);
    });

    map.forEach((list) => {
      list.sort((a, b) => a.display_order - b.display_order);
    });

    return map;
  }, [images]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [categoryResult, imageResult] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("category_images")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    if (categoryResult.error) {
      console.error(categoryResult.error);
      alert("تعذر تحميل التصنيفات");
    }

    if (imageResult.error) {
      console.error(imageResult.error);
      alert("تعذر تحميل الصور");
    }

    const loadedCategories = categoryResult.data || [];

    setCategories(loadedCategories);
    setImages(imageResult.data || []);
    setOpenCategoryId((current) => current ?? loadedCategories[0]?.id ?? null);
    setLoading(false);
  }

  async function addCategory() {
    if (addingCategory) return;

    setAddingCategory(true);

    const nextOrder =
      categories.length > 0
        ? Math.max(...categories.map((item) => item.display_order || 0)) + 1
        : 1;

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: "تصنيف جديد",
        description: "",
        image: "/images/category-candles.jpg",
        cover_image: null,
        display_order: nextOrder,
        visible: true,
      })
      .select()
      .single();

    setAddingCategory(false);

    if (error) {
      console.error(error);
      alert("تعذر إضافة التصنيف");
      return;
    }

    setCategories((current) => [...current, data]);
    setOpenCategoryId(data.id);
  }

  async function updateCategory(id, patch) {
    const previous = categories;

    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, ...patch } : category
      )
    );

    const { error } = await supabase
      .from("categories")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error(error);
      setCategories(previous);
      alert("تعذر حفظ التعديل");
      return false;
    }

    return true;
  }

  async function deleteCategory(category) {
    const confirmed = window.confirm(
      `هل تريدين حذف تصنيف “${category.name}” وكل صوره؟`
    );

    if (!confirmed) return;

    const categoryImages = imagesByCategory.get(category.id) || [];
    const paths = categoryImages
      .map((image) => storagePathFromUrl(image.image_url))
      .filter(Boolean);

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      console.error(error);
      alert("تعذر حذف التصنيف");
      return;
    }

    if (paths.length) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }

    setCategories((current) => current.filter((item) => item.id !== category.id));
    setImages((current) => current.filter((item) => item.category_id !== category.id));

    if (openCategoryId === category.id) {
      const remaining = categories.filter((item) => item.id !== category.id);
      setOpenCategoryId(remaining[0]?.id ?? null);
    }
  }

  async function uploadImages(categoryId, fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (files.some((file) => !file.type.startsWith("image/"))) {
      alert("يمكن رفع الصور فقط");
      return;
    }

    const largeFile = files.find((file) => file.size > MAX_SOURCE_IMAGE_SIZE);
    if (largeFile) {
      alert(`الصورة ${largeFile.name} أكبر من 30MB`);
      return;
    }

    setUploadingCategoryId(categoryId);

    const currentImages = imagesByCategory.get(categoryId) || [];
    let nextOrder = currentImages.length
      ? Math.max(...currentImages.map((item) => item.display_order || 0)) + 1
      : 1;

    const addedRows = [];

    for (const file of files) {
      let webpFile;

      try {
        webpFile = await compressToWebP(file);
      } catch (compressionError) {
        console.error("Image compression error:", compressionError);
        alert(`تعذر ضغط وتحويل ${file.name} إلى WebP`);
        continue;
      }

      const path = `${categoryId}/${Date.now()}-${crypto.randomUUID()}.webp`;

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, webpFile, {
          cacheControl: "31536000",
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        alert(`تعذر رفع ${file.name}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(uploaded.path);

      const { data: row, error: dbError } = await supabase
        .from("category_images")
        .insert({
          category_id: categoryId,
          image_url: publicUrlData.publicUrl,
          display_order: nextOrder,
          is_selected: false,
        })
        .select()
        .single();

      if (dbError) {
        console.error(dbError);
        await supabase.storage.from(STORAGE_BUCKET).remove([uploaded.path]);
        continue;
      }

      addedRows.push(row);
      nextOrder += 1;
    }

    if (addedRows.length) {
      setImages((current) => [...current, ...addedRows]);

      const category = categories.find((item) => item.id === categoryId);
      if (category && !category.cover_image) {
        await updateCategory(categoryId, {
          cover_image: addedRows[0].image_url,
        });
      }
    }

    setUploadingCategoryId(null);
  }

  async function deleteImage(image) {
    if (!window.confirm("حذف هذه الصورة؟")) return;

    const { error } = await supabase
      .from("category_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      console.error(error);
      alert("تعذر حذف الصورة");
      return;
    }

    const path = storagePathFromUrl(image.image_url);
    if (path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    }

    const category = categories.find((item) => item.id === image.category_id);
    const remaining = (imagesByCategory.get(image.category_id) || []).filter(
      (item) => item.id !== image.id
    );

    setImages((current) => current.filter((item) => item.id !== image.id));

    if (category?.cover_image === image.image_url) {
      await updateCategory(image.category_id, {
        cover_image: remaining[0]?.image_url || null,
      });
    }
  }

  async function setCoverImage(categoryId, imageUrl) {
    await updateCategory(categoryId, { cover_image: imageUrl });
  }

  async function toggleSelected(image) {
    const next = !image.is_selected;

    setImages((current) =>
      current.map((item) =>
        item.id === image.id ? { ...item, is_selected: next } : item
      )
    );

    const { error } = await supabase
      .from("category_images")
      .update({ is_selected: next })
      .eq("id", image.id);

    if (error) {
      console.error(error);
      setImages((current) =>
        current.map((item) =>
          item.id === image.id
            ? { ...item, is_selected: image.is_selected }
            : item
        )
      );
      alert("تعذر تعديل المختارات");
    }
  }

  async function moveImage(categoryId, imageId, direction) {
    const list = [...(imagesByCategory.get(categoryId) || [])];
    const index = list.findIndex((item) => item.id === imageId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || swapIndex < 0 || swapIndex >= list.length) return;

    const current = list[index];
    const target = list[swapIndex];

    setImages((all) =>
      all.map((item) => {
        if (item.id === current.id) {
          return { ...item, display_order: target.display_order };
        }
        if (item.id === target.id) {
          return { ...item, display_order: current.display_order };
        }
        return item;
      })
    );

    const [first, second] = await Promise.all([
      supabase
        .from("category_images")
        .update({ display_order: target.display_order })
        .eq("id", current.id),
      supabase
        .from("category_images")
        .update({ display_order: current.display_order })
        .eq("id", target.id),
    ]);

    if (first.error || second.error) {
      console.error(first.error || second.error);
      await loadData();
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      setLoggingOut(false);
      return;
    }

    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="waad-admin" dir="rtl">
      <header className="waad-admin-header">
        <div className="waad-admin-brand">
          <span className="waad-admin-mark">W</span>
          <div>
            <strong>WAAD EVENTS</strong>
            <small>إدارة التصنيفات والصور</small>
          </div>
        </div>

        <div className="waad-admin-header-actions">
          <Link className="waad-text-button" to="/">
            عرض الموقع
          </Link>
          <button
            className="waad-text-button waad-logout"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </header>

      <main className="waad-admin-main">
        <section className="waad-admin-intro">
          <div>
            <span className="waad-eyebrow">لوحة الإدارة</span>
            <h1>التصنيفات</h1>
            <p>أضيفي التصنيفات والصور، واختاري الغلاف والمختارات فقط.</p>
          </div>

          <button
            className="waad-primary-button"
            type="button"
            onClick={addCategory}
            disabled={addingCategory}
          >
            <Plus size={18} />
            {addingCategory ? "جاري الإضافة..." : "إضافة تصنيف"}
          </button>
        </section>

        {loading ? (
          <div className="waad-empty-state">جاري تحميل المحتوى...</div>
        ) : categories.length === 0 ? (
          <div className="waad-empty-state">
            <strong>لا توجد تصنيفات</strong>
            <span>اضغطي “إضافة تصنيف” للبدء.</span>
          </div>
        ) : (
          <div className="waad-category-list">
            {categories.map((category) => {
              const categoryImages = imagesByCategory.get(category.id) || [];
              const isOpen = openCategoryId === category.id;
              const selectedCount = categoryImages.filter(
                (image) => image.is_selected
              ).length;

              return (
                <article className="waad-category-card" key={category.id}>
                  <button
                    type="button"
                    className="waad-category-summary"
                    onClick={() =>
                      setOpenCategoryId(isOpen ? null : category.id)
                    }
                  >
                    <div className="waad-category-cover">
                      {category.cover_image ? (
                        <img src={category.cover_image} alt={category.name} />
                      ) : (
                        <ImagePlus size={22} />
                      )}
                    </div>

                    <div className="waad-category-title">
                      <strong>{category.name}</strong>
                      <span>
                        {categoryImages.length} صورة · {selectedCount} مختارة
                      </span>
                    </div>

                    <div className="waad-category-summary-end">
                      <span
                        className={`waad-status ${
                          category.visible ? "is-visible" : "is-hidden"
                        }`}
                      >
                        {category.visible ? "ظاهر" : "مخفي"}
                      </span>
                      <span className={`waad-chevron ${isOpen ? "is-open" : ""}`}>
                       ⌄
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="waad-category-content">
                      <div className="waad-category-settings">
                        <Field
                          label="اسم التصنيف"
                          value={category.name}
                          onChange={(value) =>
                            updateCategory(category.id, { name: value })
                          }
                        />

                        <Field
                          label="الوصف"
                          value={category.description}
                          textarea
                          onChange={(value) =>
                            updateCategory(category.id, { description: value })
                          }
                        />

                        <div className="waad-small-settings">
                          <Field
                            label="الترتيب"
                            type="number"
                            value={category.display_order}
                            onChange={(value) =>
                              updateCategory(category.id, {
                                display_order: Number(value) || 0,
                              })
                            }
                          />

                          <button
                            type="button"
                            className={`waad-visibility-button ${
                              category.visible ? "is-on" : ""
                            }`}
                            onClick={() =>
                              updateCategory(category.id, {
                                visible: !category.visible,
                              })
                            }
                          >
                            {category.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                            {category.visible ? "ظاهر في الموقع" : "مخفي من الموقع"}
                          </button>
                        </div>
                      </div>

                      <div className="waad-gallery-section">
                        <div className="waad-gallery-heading">
                          <div>
                            <h3>صور التصنيف</h3>
                            <p>
                              ⭐ للمختارات · “غلاف” للصورة الرئيسية للتصنيف
                            </p>
                          </div>

                          <label className="waad-upload-button">
                            <ImagePlus size={18} />
                            {uploadingCategoryId === category.id
                              ? "جاري الرفع..."
                              : "رفع صور"}
                            <input
                              hidden
                              multiple
                              type="file"
                              accept="image/*"
                              disabled={uploadingCategoryId === category.id}
                              onChange={async (e) => {
                                await uploadImages(category.id, e.target.files);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>

                        {categoryImages.length === 0 ? (
                          <label className="waad-upload-empty">
                            <ImagePlus size={28} />
                            <strong>لا توجد صور بعد</strong>
                            <span>اضغطي هنا لرفع صور هذا التصنيف</span>
                            <input
                              hidden
                              multiple
                              type="file"
                              accept="image/*"
                              disabled={uploadingCategoryId === category.id}
                              onChange={async (e) => {
                                await uploadImages(category.id, e.target.files);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        ) : (
                          <div className="waad-image-grid">
                            {categoryImages.map((image, index) => {
                              const isCover = category.cover_image === image.image_url;

                              return (
                                <div className="waad-image-card" key={image.id}>
                                  <div className="waad-image-preview">
                                    <img
                                      src={image.image_url}
                                      alt={`${category.name} ${index + 1}`}
                                    />

                                    <div className="waad-image-badges">
                                      {isCover && <span>غلاف</span>}
                                      {image.is_selected && (
                                        <span className="is-selected">
                                          <Star size={12} fill="currentColor" /> مختارة
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      className="waad-image-delete"
                                      onClick={() => deleteImage(image)}
                                      aria-label="حذف الصورة"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>

                                  <div className="waad-image-actions">
                                    <button
                                      type="button"
                                      className={`waad-star-button ${
                                        image.is_selected ? "is-active" : ""
                                      }`}
                                      onClick={() => toggleSelected(image)}
                                      title="إضافة إلى المختارات"
                                    >
                                      <Star
                                        size={17}
                                        fill={image.is_selected ? "currentColor" : "none"}
                                      />
                                      {image.is_selected ? "مختارة" : "مختارات"}
                                    </button>

                                    <button
                                      type="button"
                                      className={`waad-cover-button ${
                                        isCover ? "is-active" : ""
                                      }`}
                                      onClick={() =>
                                        setCoverImage(category.id, image.image_url)
                                      }
                                      disabled={isCover}
                                    >
                                      {isCover ? "الغلاف" : "اجعلها غلاف"}
                                    </button>

                                    <div className="waad-order-buttons">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveImage(category.id, image.id, "up")
                                        }
                                        disabled={index === 0}
                                        aria-label="تحريك للأعلى"
                                      >
                                        <ArrowUp size={15} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveImage(category.id, image.id, "down")
                                        }
                                        disabled={index === categoryImages.length - 1}
                                        aria-label="تحريك للأسفل"
                                      >
                                        <ArrowDown size={15} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="waad-category-footer">
                        <button
                          type="button"
                          className="waad-delete-category"
                          onClick={() => deleteCategory(category)}
                        >
                          <Trash2 size={16} />
                          حذف التصنيف
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
