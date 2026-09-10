
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useContent } from "../context/ContentContext";

function FloralMark() {
  return (
    <svg
      className="hero-floral-mark"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path d="M31 34c-10-1-16-8-17-19 11 0 19 6 21 16" />
      <path d="M34 31c1-11 8-18 19-19 0 11-6 19-16 22" />
      <path d="M31 36c-8 0-14 5-17 13 9 2 16-1 21-9" />
      <path d="M36 36c8 0 14 5 17 13-9 2-16-1-21-9" />
      <path d="M33 25v25" />
    </svg>
  );
}

export default function Hero({ startAnimation = false }) {
  const { content } = useContent();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.24, 1.34]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 68]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.72],
    [1, 0]
  );

  return (
    <section className="hero-cinematic" ref={ref}>
      <motion.div
        className="hero-cinematic-media"
        style={{ y: imageY }}
      >
        <motion.img
          src={content.hero.image}
          alt="تنسيق مناسبات من وعد إيفنتس"
          style={{ scale: imageScale }}
        />
      </motion.div>

      <div className="hero-cinematic-overlay" />
      <div className="hero-cinematic-center-shade" />

      <motion.div
        className="container hero-cinematic-content"
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        {/* BRAND */}
        <motion.div
          className="hero-brand-lockup"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={
            startAnimation
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          transition={{
            delay: 0,
            duration: 0.42,
          }}
        >
          <FloralMark />

          <strong>
            {content.site.shortName || "WAAD"}
          </strong>

          <span>EVENTS</span>

          <i />
        </motion.div>

        {/* TITLE */}
        <div className="hero-cinematic-title-wrap">
          <div className="hero-cinematic-title-mask">
            <motion.h1
              initial={{
                y: "115%",
              }}
              animate={
                startAnimation
                  ? {
                      y: 0,
                    }
                  : {
                      y: "115%",
                    }
              }
              transition={{
                delay: 0.02,
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {content.hero.titleA}
            </motion.h1>
          </div>

          <div className="hero-cinematic-title-mask">
            <motion.h1
              className="hero-cinematic-title-soft"
              initial={{
                y: "115%",
              }}
              animate={
                startAnimation
                  ? {
                      y: 0,
                    }
                  : {
                      y: "115%",
                    }
              }
              transition={{
                delay: 0.06,
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {content.hero.titleB}{" "}
              {content.hero.titleC}
            </motion.h1>
          </div>
        </div>

        {/* DESCRIPTION */}
        <motion.p
          className="hero-cinematic-text"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={
            startAnimation
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          transition={{
            delay: 0.11,
            duration: 0.42,
          }}
        >
          {content.hero.text}
        </motion.p>

        {/* ACTIONS */}
        <motion.div
          className="hero-cinematic-actions"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            startAnimation
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          transition={{
            delay: 0.16,
            duration: 0.42,
          }}
        >
          <Link
            className="hero-action-light"
            to="/contact"
          >
            ابدأ طلبك
            <ArrowLeft size={16} />
          </Link>

          <Link
            className="hero-action-ghost"
            to="/collections"
          >
            شاهد التصنيفات
          </Link>
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.a
        className="hero-cinematic-scroll"
        href="#categories"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={
          startAnimation
            ? {
                opacity: 1,
                y: 0,
              }
            : {
                opacity: 0,
                y: 10,
              }
        }
        transition={{
          delay: 0.24,
          duration: 0.4,
        }}
      >
        <span>مرر للأسفل</span>

        <ArrowDown size={15} />
      </motion.a>
    </section>
  );
}
