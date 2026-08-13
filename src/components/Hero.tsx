"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* COLUMNA IZQUIERDA: TEXTOS Y CTA */}
        <div className="hero-content">
          {/* Badge de destinos */}
          <div className="hero-badge">
            <i className="fa-solid fa-plane"></i>
            <span>España · México · Destinos internacionales</span>
          </div>

          {/* Título Principal */}
          <h1 className="hero-title">
            Tu paquete, <span className="text-purple">siempre</span>{" "}
            <span className="text-gradient">bajo control.</span>
          </h1>

          {/* Descripción */}
          <p className="hero-subtitle">
            Rastrea tus envíos de forma rápida, fácil y completamente segura.
          </p>

          {/* Botones de acción */}
          <div className="hero-actions">
            <Link href="/suivi" className="btn-hero-primary">
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Rastrear mi paquete</span>
              <i className="fa-solid fa-arrow-right arrow-icon"></i>
            </Link>

            <Link href="#contact" className="btn-hero-secondary">
              <i className="fa-solid fa-headset"></i>
              <span>Contáctanos</span>
            </Link>
          </div>

          {/* Garantías / Características */}
          <div className="hero-features">
            <div className="feature-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Envíos rastreados</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-clock"></i>
              <span>Estados actualizados</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-headset"></i>
              <span>Atención continua</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ILUSTRACIÓN SVG ANIMADA */}
        <div className="hero-illustration">
          <div className="map-card-wrapper">
            <svg
              className="map-svg"
              viewBox="0 0 500 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fondo Mapa Morado */}
              <rect width="500" height="350" rx="28" fill="#4a0099" />

              {/* Formas continentales / islas de fondo */}
              <path
                d="M 80 180 Q 120 150 160 180 T 200 220 Q 140 260 80 180 Z"
                fill="rgba(255, 255, 255, 0.12)"
              />
              <path
                d="M 230 130 Q 280 100 330 140 T 310 200 Q 240 210 230 130 Z"
                fill="rgba(255, 255, 255, 0.12)"
              />
              <path
                d="M 300 240 Q 360 210 410 260 T 370 310 Q 310 320 300 240 Z"
                fill="rgba(255, 255, 255, 0.12)"
              />

              {/* Línea continua de entrega (Camión -> Punto de ruta) */}
              <path
                d="M 100 260 C 180 260, 200 210, 270 210"
                stroke="#d96b00"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Línea curva punteada ANIMADA (Punto de ruta -> Destino) */}
              <path
                className="animated-dash-line"
                d="M 270 210 C 330 210, 370 140, 430 170"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Punto de Ruta (Círculo Naranja) */}
              <circle cx="270" cy="210" r="10" fill="#d96b00" />
              <circle
                cx="270"
                cy="210"
                r="18"
                stroke="#d96b00"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="pulsing-ring"
              />

              {/* Punto Final / Destino */}
              <circle cx="430" cy="170" r="7" fill="#e2d4ff" />

              {/* Ícono Camión / Paquete */}
              <g transform="translate(65, 225)">
                <rect x="0" y="15" width="45" height="20" rx="4" fill="#ffffff" />
                <path d="M 45 20 L 58 20 L 65 27 L 65 35 L 45 35 Z" fill="#d96b00" />
                <circle cx="15" cy="37" r="5" fill="#111" />
                <circle cx="52" cy="37" r="5" fill="#111" />
                <rect x="12" y="20" width="10" height="10" rx="2" fill="#d96b00" />
              </g>

              {/* Tarjeta Flotante Superior Izquierda */}
              <foreignObject x="30" y="30" width="180" height="70">
                <div className="glass-card">
                  <div className="glass-icon-orange">
                    <i className="fa-solid fa-box"></i>
                  </div>
                  <div className="glass-lines">
                    <div className="line-long purple"></div>
                    <div className="line-short"></div>
                  </div>
                </div>
              </foreignObject>

              {/* Tarjeta Flotante Inferior Derecha */}
              <foreignObject x="280" y="240" width="190" height="70">
                <div className="glass-card">
                  <div className="glass-icon-purple">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="glass-lines">
                    <div className="line-long primary"></div>
                    <div className="line-short"></div>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}