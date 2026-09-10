import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { initialContent } from "../data/siteData";
import { supabase } from "../lib/supabaseClient";

const Context = createContext(null);

const KEY = "waad-events-content-v2";

const load = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(KEY)) ||
      initialContent
    );
  } catch {
    return initialContent;
  }
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(load);
  const [loadingContent, setLoadingContent] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSupabaseContent() {
      setLoadingContent(true);

      const [
        { data: categoryData, error: categoryError },
        { data: imageData, error: imageError },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .order("display_order", {
            ascending: true,
          }),

        supabase
          .from("category_images")
          .select("*")
          .order("display_order", {
            ascending: true,
          })
          .order("created_at", {
            ascending: true,
          }),
      ]);

      if (!mounted) return;

      if (categoryError) {
        console.error(
          "Error loading categories:",
          categoryError
        );
      }

      if (imageError) {
        console.error(
          "Error loading category images:",
          imageError
        );
      }

      if (categoryError || imageError) {
        setLoadingContent(false);
        return;
      }

      const categories = (categoryData || []).map(
        (category) => {
          const gallery = (imageData || [])
            .filter(
              (image) =>
                image.category_id === category.id
            )
            .map((image) => ({
              id: image.id,
              categoryId: image.category_id,
              image: image.image_url,
              imageUrl: image.image_url,
              order: image.display_order,
              selected: image.is_selected,
              createdAt: image.created_at,
            }));

          const firstGalleryImage =
            gallery[0]?.image || "";

          const coverImage =
            category.cover_image ||
            category.image ||
            firstGalleryImage ||
            "";

          return {
            id: category.id,
            name: category.name,
            description:
              category.description || "",
            image: coverImage,
            coverImage,
            order:
              category.display_order ?? 0,
            visible:
              category.visible !== false,
            images: gallery,
          };
        }
      );

      const categoryMap = new Map(
        categories.map((category) => [
          category.id,
          category,
        ])
      );

      const featured = (imageData || [])
        .filter((image) => image.is_selected)
        .map((image) => {
          const category = categoryMap.get(
            image.category_id
          );

          return {
            id: `selected-${image.id}`,
            sourceId: image.id,
            categoryId: image.category_id,
            title:
              category?.name || "Waad Events",
            category:
              category?.name || "Waad Events",
            subtitle:
              category?.description || "",
            image: image.image_url,
            visible: true,
            order:
              image.display_order ?? 0,
          };
        });

      setContent((current) => ({
        ...current,
        categories,
        featured,
      }));

      setLoadingContent(false);
    }

    loadSupabaseContent();

    return () => {
      mounted = false;
    };
  }, []);

  const update = (next) => {
    setContent(next);

    localStorage.setItem(
      KEY,
      JSON.stringify(next)
    );
  };

  const reset = () => {
    setContent(initialContent);
    localStorage.removeItem(KEY);
  };

  const value = useMemo(
    () => ({
      content,
      update,
      reset,
      loadingContent,
    }),
    [content, loadingContent]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export const useContent = () =>
  useContext(Context);
