"use client";

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: "fa-solid fa-headset",
      title: "Contáctanos",
      description:
        "Solicita información sobre tu envío a través de nuestros canales de atención al cliente.",
    },
    {
      number: "02",
      icon: "fa-solid fa-box-archive",
      title: "Registramos tu paquete",
      description:
        "Nuestro equipo registra el envío y genera un número de rastreo único.",
    },
    {
      number: "03",
      icon: "fa-solid fa-route",
      title: "Rastreamos tu envío",
      description:
        "Te mantenemos informado sobre el estado y la ubicación de tu paquete en todo momento.",
    },
    {
      number: "04",
      icon: "fa-solid fa-magnifying-glass",
      title: "Consulta el estado",
      description:
        "Ingresa tu número de rastreo para ver las últimas actualizaciones.",
    },
  ];

  return (
    <section id="proceso" className="process-section">
      <div className="process-container">
        {/* Encabezado Centrado */}
        <div className="process-header">
          <span className="process-badge">PROCESO</span>
          <h2 className="process-title">¿Cómo funciona?</h2>
        </div>

        {/* Rejilla de Pasos */}
        <div className="process-grid">
          {steps.map((step) => (
            <div key={step.number} className="process-card">
              <div className="process-card-top">
                <div className="process-icon">
                  <i className={step.icon}></i>
                </div>
                <span className="process-number">{step.number}</span>
              </div>
              <h3 className="process-card-title">{step.title}</h3>
              <p className="process-card-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}