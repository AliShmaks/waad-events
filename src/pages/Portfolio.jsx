import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { X } from "lucide-react";
import {
  useSearchParams,
} from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { useContent } from "../context/ContentContext";

export default function Portfolio() {
  const { content } = useContent();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [light, setLight] =
    useState(null);

  const visibleCategories = useMemo(
    () =>
      content.categories
        .filter((x) => x.visible)
        .sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0)
        ),
    [content.categories]
  );

  const categoryParam =
    searchParams.get("category");

  const selectedCategory =
    visibleCategories.find(
      (category) =>
        String(category.id) ===
        String(categoryParam)
    );

  const [active, setActive] =
    useState("all");

  useEffect(() => {
    if (selectedCategory) {
      setActive(
        String(selectedCategory.id)
      );
    } else if (!categoryParam) {
      setActive("all");
    }
  }, [
    categoryParam,
    selectedCategory,
  ]);

  const galleryItems = useMemo(() => {
    return visibleCategories.flatMap(
      (category) =>
        (category.images || []).map(
          (image) => ({
            id: image.id,
            categoryId:
              category.id,
            title: category.name,
            category:
              category.name,
            subtitle:
              category.description,
            image: image.image,
            order:
              image.order ?? 0,
          })
        )
    );
  }, [visibleCategories]);

  const items =
    active === "all"
      ? galleryItems
      : galleryItems.filter(
          (item) =>
            String(
              item.categoryId
            ) === String(active)
        );

  function changeCategory(id) {
    setActive(id);
    setLight(null);

    if (id === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      category: String(id),
    });
  }

  return (
    <PageTransition className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal>
            <p className="eyebrow">
              Waad Collections
            </p>

            <h1 className="display">
              كل التفاصيل
              <br />
              <em>في مكان واحد.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="lead">
              تصفحي الأفكار والتصنيفات،
              وبعدها نخصص القطعة حسب الاسم،
              اللون والمناسبة.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="container">
          <div className="filter-bar">
            <button
              className={`filter-btn ${
                active === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                changeCategory("all")
              }
            >
              الكل
            </button>

            {visibleCategories.map(
              (category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${
                    String(active) ===
                    String(category.id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    changeCategory(
                      String(
                        category.id
                      )
                    )
                  }
                >
                  {category.name}
                </button>
              )
            )}
          </div>

          {items.length ? (
            <div className="portfolio-grid">
              {items.map((item, index) => (
                <motion.article
                  className="portfolio-card"
                  key={`${item.id}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(
                      index * 0.04,
                      0.2
                    ),
                  }}
                  onClick={() =>
                    setLight(item)
                  }
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />

                  <div className="portfolio-meta">
                    <h3>
                      {item.title}
                    </h3>
                    <span>
                      {item.subtitle ||
                        item.category}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                padding:
                  "60px 0",
                textAlign:
                  "center",
              }}
            >
              <p className="lead">
                لا توجد صور في هذا التصنيف
                بعد.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {light && (
          <motion.div
            className="lightbox"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setLight(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                setLight(null)
              }
              aria-label="إغلاق الصورة"
            >
              <X />
            </button>

            <img
              src={light.image}
              alt={light.title}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
