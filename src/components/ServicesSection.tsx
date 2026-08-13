"use client";

import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      icon: "fa-solid fa-earth-americas",
      title: "Envío internacional",
      description:
        "Coordinamos envíos entre España, México y otros destinos internacionales.",
    },
    {
      icon: "fa-solid fa-map-location-dot",
      title: "Rastreo de paquetes",
      description:
        "Consulte en todo momento el estado y la ubicación exacta de su envío.",
    },
    {
      icon: "fa-solid fa-truck-fast",
      title: "Gestión logística",
      description:
        "Organizamos cada etapa del trayecto con controles y registros claros.",
    },
    {
      icon: "fa-solid fa-headset",
      title: "Atención al cliente",
      description:
        "Nuestro equipo le asistirá y responderá a sus dudas con respecto a la entrega.",
    },
  ];

  return (
    <section id="servicios" className="services-section">
      <div className="services-container">
        {/* Encabezado de sección */}
        <div className="services-header">
          <span className="services-badge">SERVICIOS</span>
          <h2 className="services-title">Nuestros servicios</h2>
          <p className="services-subtitle">
            Acompañamos cada envío con procedimientos claros, información actualizada y un soporte cercano.
          </p>
        </div>

        {/* Rejilla de tarjetas */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}