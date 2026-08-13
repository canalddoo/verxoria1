import Hero from "@/components/Hero";
import TrackingSection from "@/components/TrackingSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import Partners from "@/components/Partners";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrackingSection />
      <ProcessSection />
      <Partners />
      <ServicesSection />
      <div className="cta-banner">
        <div className="cta-banner-content">
          <h2 className="cta-banner-title">¿Tiene un número de rastreo?</h2>
          <p className="cta-banner-subtitle">
            Consulte en unos segundos el estado actual y el historial completo de su envío.
          </p>
          <a href="#rastrear" className="btn-cta-banner">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Rastrear mi paquete</span>
          </a>
        </div>
      </div>
    </div>
  );
}