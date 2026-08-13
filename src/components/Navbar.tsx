"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "#servicios" },
    { name: "Rastrear", href: "#rastrear" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* LOGO */}
        <Link href="/" className="navbar-logo">
          <Image
            src="/img/logo.png"
            alt="VEX ORIA"
            width={160}
            height={42}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="desktop-nav">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA DESKTOP */}
        <div className="desktop-cta">
          <Link href="/suivi" className="btn-cta">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Rastrear mi paquete</span>
          </Link>
        </div>

        {/* BOTÓN MÓVIL (MENÚ HAMBURGUESA) */}
        <button
          className="mobile-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* OVERLAY Y MENÚ MÓVIL */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/img/logo.png"
              alt="VEX ORIA"
              width={150}
              height={40}
            />
          </Link>
          <button className="mobile-toggle" onClick={toggleMenu}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`mobile-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.name}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mobile-cta-wrapper">
          <Link
            href="/suivi"
            className="btn-cta full-width"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Rastrear mi paquete</span>
          </Link>
        </div>
      </div>
    </header>
  );
}