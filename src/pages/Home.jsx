import Hero from "../components/Hero";
import CategoryShowcase from "../components/CategoryShowcase";
import SelectedWork from "../components/SelectedWork";
import Reveal from "../components/Reveal";
import ServicesPreview from "../components/ServicesPreview";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import PageTransition from "../components/PageTransition";
import { useContent } from "../context/ContentContext";

export default function Home({ heroReady }) {
  const { content } = useContent();

  return (
    <PageTransition>
    <Hero startAnimation={heroReady} />
      <CategoryShowcase />
      <SelectedWork />

      <section className="section about-home">
        <div className="container about-home-grid">
          <Reveal>
            <div className="about-home-image">
              <img src={content.about.image} alt="Waad Events" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow">{content.about.eyebrow}</span>
            <h2 className="title-lg">{content.about.title}</h2>
            <p className="lead">{content.about.text}</p>
          </Reveal>
        </div>
      </section>

      <ServicesPreview />
      <Testimonials />
      <CTA />
    </PageTransition>
  );
}
