import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Loader({ onDone }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHide(true);
    }, 1700);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="waad-loader"
      initial={{ y: 0 }}
      animate={{ y: hide ? "-100%" : 0 }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={() => {
        if (hide) {
          onDone();
        }
      }}
    >
      <div className="waad-loader-inner">
        <div className="waad-loader-meta" />

        <div className="waad-loader-word-wrap">
          <motion.div
            className="waad-loader-word"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            WAAD
          </motion.div>
        </div>

        <div className="waad-loader-line">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.25,
              delay: 0.16,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}