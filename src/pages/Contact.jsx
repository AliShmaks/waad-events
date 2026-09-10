
import { useMemo, useState } from "react";
import { MessageCircle, Phone, User, Tag, Send } from "lucide-react";

import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import { useContent } from "../context/ContentContext";

export default function Contact() {
  const { content } = useContent();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    message: "",
  });

  const categories = useMemo(() => {
    return (content.categories || [])
      .filter((category) => category.visible)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [content.categories]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const message = `
مرحباً Waad Events ✨

الاسم: ${form.name}
رقم الهاتف: ${form.phone}
التصنيف: ${form.category}

تفاصيل الطلب:
${form.message}
    `.trim();

    const whatsappUrl = `https://wa.me/${
      content.site.phoneRaw
    }?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <PageTransition className="page-shell">
      <section className="contact-new-hero">
        <div className="container contact-new-hero-grid">
          <Reveal>
            <div className="contact-new-heading">
              <span className="eyebrow">تواصل معنا</span>

              <h1 className="display">
                فكرتك تبدأ
                <br />
                <em>من هنا.</em>
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="lead contact-new-intro">
              شاركنا تفاصيل مناسبتك، واختر التصنيف الذي تهتم به.
              سنفتح لك واتساب برسالة جاهزة بكل التفاصيل.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="contact-new-section">
        <div className="container contact-new-layout">

          {/* LEFT SIDE */}
          <Reveal>
            <div className="contact-new-info">
              <span className="contact-new-number">01</span>

              <h2>
                نصنع التفاصيل
                <br />
                <em>بطريقتك.</em>
              </h2>

              <p>
                سواء كانت المناسبة زفاف، تخرج، مولود أو أي لحظة خاصة،
                أخبرنا بما تتخيله وسنساعدك في تحويل الفكرة إلى شيء مميز.
              </p>

              <div className="contact-new-details">
                <div>
                  <span>الموقع</span>
                  <strong>{content.site.location}</strong>
                </div>

                <div>
                  <span>WhatsApp</span>
                  <strong>{content.site.phoneDisplay}</strong>
                </div>

                <div>
                  <span>TikTok</span>

                  <a
                    href={content.site.tiktok}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.site.tiktokHandle}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* FORM */}
          <Reveal delay={0.1}>
            <div className="contact-new-form-card">
              <div className="contact-new-form-head">
                <span>طلب جديد</span>

                <MessageCircle size={21} />
              </div>

              <h3>أخبرنا عن فكرتك</h3>

              <p>
                املأ التفاصيل وسنجهز لك الرسالة تلقائياً على واتساب.
              </p>

              <form onSubmit={handleSubmit} className="contact-new-form">

                {/* NAME */}
                <label className="contact-new-field">
                  <span>
                    <User size={15} />
                    الاسم
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="اكتب اسمك"
                    required
                  />
                </label>

                {/* PHONE */}
                <label className="contact-new-field">
                  <span>
                    <Phone size={15} />
                    رقم الهاتف
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+966 5X XXX XXXX"
                    required
                  />
                </label>

                {/* CATEGORY */}
                <label className="contact-new-field">
                  <span>
                    <Tag size={15} />
                    التصنيف
                  </span>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      اختر التصنيف
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* MESSAGE */}
                <label className="contact-new-field contact-new-field-full">
                  <span>تفاصيل الطلب</span>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="مثلاً: أريد 50 شمعة لحفل زفاف بألوان أوف وايت وذهبي..."
                    rows="5"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="contact-new-submit"
                >
                  <span>إرسال الطلب عبر واتساب</span>

                  <Send size={18} />
                </button>

                <small className="contact-new-note">
                  سيتم فتح واتساب برسالتك جاهزة للإرسال.
                </small>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}

