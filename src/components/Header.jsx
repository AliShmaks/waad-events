import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useContent } from "../context/ContentContext";

const links = [
  ["/", "الرئيسية"],
  ["/collections", "التصنيفات"],
  ["/about", "من نحن"],
  ["/contact", "تواصل معنا"],
];

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.321 5.562a5.124 5.124 0 0 1-3.53-1.497A5.124 5.124 0 0 1 14.294.536h-3.26v14.13a2.73 2.73 0 1 1-2.73-2.73c.28 0 .55.042.805.12V8.74a6.034 6.034 0 1 0 5.185 5.926V7.493a8.37 8.37 0 0 0 5.027 1.7V5.562Z" />
    </svg>
  );
}

export default function Header() {
  const { content } = useContent();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <header
        className={[
          "site-header",
          scrolled ? "scrolled" : "",
          isHome && !scrolled ? "home-top" : "",
        ].join(" ")}
      >
        <div className="container nav">
          <NavLink to="/" className="brand">
            <strong>{content.site.name}</strong>
            <span>Custom Events · KSA</span>
          </NavLink>

          <nav className="desktop-nav">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}

            <a
              href="https://www.tiktok.com/@waadevents"
              target="_blank"
              rel="noreferrer"
              className="nav-tiktok"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>

            <NavLink to="/contact" className="nav-cta">
              اطلب الآن
            </NavLink>
          </nav>

          <div className="mobile-nav-actions">
            <a
              href="https://www.tiktok.com/@waadevents"
              target="_blank"
              rel="noreferrer"
              className="nav-tiktok mobile-tiktok"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>

            <button
              className="menu-toggle"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              className="container mobile-menu-inner"
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.07,
                  },
                },
              }}
            >
              {links.map(([to, label]) => (
                <motion.div
                  key={to}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <NavLink to={to} end={to === "/"}>
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <a
                href="https://www.tiktok.com/@waadevents"
                target="_blank"
                rel="noreferrer"
                className="mobile-menu-tiktok"
              >
                <TikTokIcon />
                <span>TikTok</span>
              </a>

              <small>
                {content.site.location} · {content.site.tiktokHandle}
              </small>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}