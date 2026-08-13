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

// Pasos estándar del recorrido de entrega
const STEPS = [
  { id: "Étiquette créée", label: "Etiqueta creada" },
  { id: "Pris en charge", label: "En camino / Recibido" },
  { id: "En transit", label: "En tránsito" },
  { id: "En cours de livraison", label: "En reparto" },
  { id: "Livré", label: "Entregado" },
];

export default function SuiviPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packageData, setPackageData] = useState<PackageDetails | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError("");
    setPackageData(null);

    try {
      const res = await fetch(`/api/colis/track?code=${encodeURIComponent(trackingCode.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al realizar la búsqueda");
      }

      setPackageData(data.package);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillExample = (code: string) => {
    setTrackingCode(code);
  };

  // Cálculo del índice del paso actual
  const getCurrentStepIndex = (status: string) => {
    const index = STEPS.findIndex((s) => s.id === status);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="public-tracking-page">
      <main className="tracking-content">
        <div className="tracking-hero">
          <span className="tracking-section-label">RASTREO</span>
          <h1 className="tracking-title">Consulte el estado de su paquete</h1>
          <p className="tracking-subtitle">
            Ingrese el número de seguimiento proporcionado para consultar la ruta completa.
          </p>

          {/* Formulario de Búsqueda */}
          <form onSubmit={handleSearch} className="tracking-search-form">
            <div className="tracking-input-wrapper">
              <i className="fa-solid fa-magnifying-glass tracking-search-icon"></i>
              <input
                type="text"
                placeholder="Ingrese su número de seguimiento"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="tracking-input"
              />
              <button type="submit" className="btn-track-submit" disabled={loading}>
                <span>{loading ? "Buscando..." : "Rastrear paquete"}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </form>

          {/* Ejemplo de demostración */}
          <div className="demo-example">
            <span>Ejemplo de demostración: </span>
            <button
              type="button"
              onClick={() => fillExample("VEX-2026-0001")}
              className="demo-code-badge"
            >
              VEX-2026-0001
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="tracking-error-card">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Resultados del rastreo estilo UPS */}
        {packageData && (
          <div className="ups-tracking-card">
            {/* Encabezado del paquete */}
            <div className="ups-header">
              <span className="ups-tracking-number">{packageData.trackingCode}</span>
              <span className="ups-package-name">{packageData.packageName}</span>
            </div>

            {/* Timeline / Recorrido del paquete */}
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
                      isCurrent ? "current" : isPassed ? "passed" : "upcoming"
                    }`}
                  >
                    {/* Indicador visual (líneas + círculo/icono) */}
                    <div className="timeline-marker-container">
                      {/* Icono del estado */}
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

                      {/* Línea de conexión (excepto en el último elemento) */}
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`timeline-line ${
                            idx < currentIndex ? "line-solid" : "line-dashed"
                          }`}
                        ></div>
                      )}
                    </div>

                    {/* Contenido textual del paso */}
                    <div className="timeline-content">
                      <h4 className={`step-title ${isCurrent ? "font-bold" : ""}`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <p className="step-location">
                          {packageData.originCity}, {packageData.originCountry} &rarr;{" "}
                          {packageData.destinationCity}, {packageData.destinationCountry}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="ups-divider" />

            {/* Sección Destinatario */}
            <div className="ups-recipient-section">
              <span className="ups-recipient-label">Enviar a / Destinatario</span>
              <p className="ups-recipient-name">{packageData.recipient}</p>
              <p className="ups-recipient-address">
                {packageData.destinationCity}, {packageData.destinationCountry}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}