import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { useContent } from "../context/ContentContext";

const MotionLink = motion.create(Link);

export default function CategoryShowcase() {
  const { content } = useContent();

  const items = content.categories
    .filter((x) => x.visible)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5);

  if (!items.length) return null;

  return (
    <section
      id="categories"
      className="section category-showcase"
    >
      <div className="container">
        <div className="category-showcase-head">
          <Reveal>
            <span className="eyebrow">
              اكتشف التفاصيل
            </span>

            <h2 className="title-xl">
              اختار <em>مناسبتك.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="lead category-showcase-copy">
              كل تصنيف له أسلوبه الخاص، ونقدر
              نعدل الاسم واللون والتغليف حتى
              يناسب فكرتك.
            </p>
          </Reveal>
        </div>

        <div className="category-cards">
          {items.map((item, index) => (
            <MotionLink
              key={item.id}
              to={`/collections?category=${encodeURIComponent(
                item.id
              )}`}
              className="category-card"
              initial={{
                opacity: 0,
                y: 28,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.07,
              }}
            >
              {item.coverImage || item.image ? (
                <img
                  src={
                    item.coverImage ||
                    item.image
                  }
                  alt={item.name}
                  loading="lazy"
                />
              ) : (
                <div className="category-card-placeholder" />
              )}

              <div className="category-card-shade" />

              <div className="category-card-top">
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <ArrowUpRight size={18} />
              </div>

              <div className="category-card-bottom">
                <h3>{item.name}</h3>
                <span>
                  {item.description}
                </span>
              </div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
