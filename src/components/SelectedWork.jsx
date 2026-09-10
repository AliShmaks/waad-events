import { motion } from "motion/react";
import { ArrowUpLeft } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../context/ContentContext";

export default function SelectedWork() {
  const { content } = useContent();

  const items = content.featured
    .filter((item) => item.visible)
    .sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0)
    )
    .slice(0, 4);

  if (!items.length) return null;

  return (
    <section
      className="section selected-work"
      id="work"
    >
      <div className="container">
        <div className="selected-work-head">
          <Reveal>
            <span className="eyebrow">
              SELECTED WORK
            </span>

            <h2 className="title-xl">
              تفاصيل صنعت <em>اللحظة.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="selected-work-intro">
              <p className="lead">
                نماذج مختارة من أعمال Waad
                Events. كل قطعة قابلة للتخصيص
                حسب المناسبة، الاسم، الألوان
                والتغليف.
              </p>

              <a
                className="text-link selected-work-link"
                href={content.site.tiktok}
                target="_blank"
                rel="noreferrer"
              >
                المزيد على TikTok
                <ArrowUpLeft size={16} />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="selected-work-grid">
          {items.map((item, index) => (
            <motion.article
              className="selected-work-card"
              key={item.id}
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
                delay: Math.min(
                  index * 0.06,
                  0.18
                ),
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <div className="selected-work-media">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  whileHover={{
                    scale: 1.025,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                />

                <span className="selected-work-index">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <div className="selected-work-meta">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>

                {item.subtitle && (
                  <span>
                    {item.subtitle}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
