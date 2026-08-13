"use client";

import { useState } from "react";

interface PackageDetails {
  id: string;
  trackingCode: string;
  packageName: string;
  recipient: string;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  status: string;
  createdAt: string;
}

// Etapas del proceso de entrega traducidas al español
const STEPS = [
  { id: "Étiquette créée", label: "Etiqueta creada" },
  { id: "Pris en charge", label: "Recibido en origen" },
  { id: "En transit", label: "En camino" },
  { id: "En cours de livraison", label: "En reparto" },
  { id: "Livré", label: "Entregado" },
];

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packageData, setPackageData] = useState<PackageDetails | null>(null);

  const handleDemoClick = () => {
    setTrackingNumber("VEX-2026-0001");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError("");
    setPackageData(null);

    try {
      const res = await fetch(
        `/api/colis/track?code=${encodeURIComponent(trackingNumber.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al buscar el paquete.");
      }

      setPackageData(data.package);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    const index = STEPS.findIndex((s) => s.id === status);
    return index !== -1 ? index : 0;
  };

  return (
    <section id="rastrear" className="tracking-section">
      <div className="tracking-container">
        <div className="tracking-card">
          {/* Badge e icono superior */}
          <div className="tracking-icon-badge">
            <i className="fa-solid fa-map-location-dot"></i>
          </div>

          {/* Título y Subtítulo */}
          <h2 className="tracking-title">¿Dónde está mi paquete?</h2>
          <p className="tracking-subtitle">
            Ingrese su número de guía o seguimiento para consultar el estado y la ubicación de su envío.
          </p>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSubmit} className="tracking-form-wrapper">
            <div className="tracking-input-group">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                placeholder="Ingrese su número de rastreo"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="tracking-input"
              />
              <button
                type="submit"
                className="btn-tracking-submit"
                disabled={loading}
              >
                <span>{loading ? "Buscando..." : "Rastrear paquete"}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </form>

          {/* Ejemplo de demostración */}
          <div className="tracking-demo">
            <span>Ejemplo de demostración: </span>
            <button
              type="button"
              onClick={handleDemoClick}
              className="demo-tag"
            >
              VEX-2026-0001
            </button>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="tracking-error-card">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Resultados del rastreo: Timeline y Destinatario */}
          {packageData && (
            <div className="ups-tracking-card">
              {/* Encabezado del paquete */}
              <div className="ups-header">
                <span className="ups-tracking-number">
                  {packageData.trackingCode}
                </span>
                <span className="ups-package-name">
                  {packageData.packageName}
                </span>
              </div>

              {/* Recorrido del paquete */}
              <div className="ups-timeline">
                {STEPS.map((step, idx) => {
                  const currentIndex = getCurrentStepIndex(packageData.status);
                  const isPassed = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  const isUpcoming = idx > currentIndex;

                  return (
                    <div
                      key={step.id}
                      className={`timeline-step ${
                        isCurrent
                          ? "current"
                          : isPassed
                          ? "passed"
                          : "upcoming"
                      }`}
                    >
                      <div className="timeline-marker-container">
                        <div className="timeline-icon-box">
                          {isPassed && (
                            <div className="icon-passed">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          )}

                          {isCurrent && (
                            <div className="icon-current-animated">
                              <i className="fa-solid fa-box"></i>
                            </div>
                          )}

                          {isUpcoming && <div className="icon-upcoming"></div>}
                        </div>

                        {idx < STEPS.length - 1 && (
                          <div
                            className={`timeline-line ${
                              idx < currentIndex ? "line-solid" : "line-dashed"
                            }`}
                          ></div>
                        )}
                      </div>

                      <div className="timeline-content">
                        <h4
                          className={`step-title ${
                            isCurrent ? "font-bold" : ""
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <p className="step-location">
                            {packageData.originCity},{" "}
                            {packageData.originCountry} &rarr;{" "}
                            {packageData.destinationCity},{" "}
                            {packageData.destinationCountry}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="ups-divider" />

              {/* Destinatario */}
              <div className="ups-recipient-section">
                <span className="ups-recipient-label">
                  Enviar a / Destinatario
                </span>
                <p className="ups-recipient-name">{packageData.recipient}</p>
                <p className="ups-recipient-address">
                  {packageData.destinationCity},{" "}
                  {packageData.destinationCountry}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}