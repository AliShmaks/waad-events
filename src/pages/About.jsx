import { Sparkles, Heart, Palette, PackageCheck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Reveal from "../components/Reveal";
import CTA from "../components/CTA";
import { useContent } from "../context/ContentContext";

export default function About() {
  const { content } = useContent();

  return (
    <PageTransition className="page-shell">

      {/* HERO */}
      <section className="about-new-hero">
        <div className="container about-new-hero-grid">
          <Reveal>
            <div>
              <span className="eyebrow">عن Waad Events</span>

              <h1 className="display">
                نصنع التفاصيل
                <br />
                <em>التي تبقى.</em>
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="about-new-intro">
              <p>
                {content.about.text}
              </p>

              <span>
                هدايا وتفاصيل مخصصة للمناسبات
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story-section">
        <div className="container about-story-grid">

          <Reveal>
            <div className="about-story-image">
              <img
                src={content.about.image}
                alt="Waad Events"
              />

              <div className="about-story-badge">
                <span>WAAD</span>
                <strong>EVENTS</strong>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="about-story-copy">
              <span className="about-story-number">01</span>

              <span className="eyebrow">
                من الفكرة إلى القطعة
              </span>

              <h2>
                {content.about.title}
              </h2>

              <p>
                نؤمن أن أجمل المناسبات تبدأ من التفاصيل الصغيرة.
                لذلك نهتم باللون، الاسم، التغليف والتصميم حتى تشعري
                أن كل قطعة صنعت خصيصاً لمناسبتك.
              </p>

              <p>
                من الزفاف والخطوبة إلى استقبال المولود والتخرج،
                هدفنا أن تتحول فكرتك إلى قطعة جميلة تحمل طابعك الخاص.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section">
        <div className="container">

          <Reveal>
            <div className="about-values-head">
              <span className="eyebrow">ما يميز Waad Events</span>

              <h2 className="title-lg">
                كل شيء يبدأ
                <br />
                <em>بالتفاصيل.</em>
              </h2>
            </div>
          </Reveal>

          <div className="about-values-grid">

            <Reveal>
              <article className="about-value-card">
                <Sparkles size={22} />

                <span>01</span>

                <h3>تصميم مخصص</h3>

                <p>
                  كل مناسبة لها أسلوبها الخاص، لذلك نخصص التصميم
                  والألوان والتفاصيل حسب فكرتك.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.06}>
              <article className="about-value-card">
                <Palette size={22} />

                <span>02</span>

                <h3>اهتمام بالتفاصيل</h3>

                <p>
                  نركز على تناسق الألوان، شكل القطعة وطريقة تقديمها
                  حتى تكون النتيجة مرتبة وأنيقة.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.12}>
              <article className="about-value-card">
                <Heart size={22} />

                <span>03</span>

                <h3>صنعت لمناسبتك</h3>

                <p>
                  نريد أن تشعري أن القطعة تمثل مناسبتك أنت،
                  وليست مجرد منتج جاهز.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.18}>
              <article className="about-value-card">
                <PackageCheck size={22} />

                <span>04</span>

                <h3>لمسة نهائية جميلة</h3>

                <p>
                  من أول فكرة حتى التغليف النهائي، نهتم أن تصل
                  القطعة بالشكل الذي يليق بلحظتك.
                </p>
              </article>
            </Reveal>

          </div>
        </div>
      </section>

      <CTA />

    </PageTransition>
  );
}