"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Rejilla principal */}
        <div className="footer-grid">
          {/* Columna 1: Marca / Logo y descripción */}
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <Image 
                src="/img/logo.png" 
                alt="Logo VEXORIA" 
                width={160} 
                height={40} 
                className="footer-logo-img"
                priority
              />
            </div>
            <p className="footer-description">
              Soluciones de envío y rastreo de paquetes.
            </p>
          </div>

          {/* Columna 2: Enlaces (ENLACES) */}
          <div className="footer-col">
            <h4 className="footer-title">ENLACES</h4>
            <ul className="footer-links">
              <li><Link href="#inicio">Inicio</Link></li>
              <li><Link href="/suivi">Rastreo</Link></li>
              <li><Link href="#servicios">Servicios</Link></li>
              <li><Link href="#nosotros">Nosotros</Link></li>
              <li><Link href="#contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Medio de contacto (CONTACTO) */}
          <div className="footer-col">
            <h4 className="footer-title">CONTACTO</h4>
            <ul className="footer-links footer-contact-links">
              <li>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior (Copyright y aviso de seguridad) */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 VEXORIA. Todos los derechos reservados.
          </p>
          <div className="footer-bottom-links">
            <span className="secure-badge">
              <i className="fa-solid fa-shield-halved"></i> Rastreo seguro de envíos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}