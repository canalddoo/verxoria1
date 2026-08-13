"use client";

import Image from "next/image";

export default function Partners() {
  const partners = [
    { name: "FedEx", logo: "/img/fedex.jpg", width: 120, height: 40 },
    { name: "Amazon", logo: "/img/Amazon.jpg", width: 120, height: 40 },
    { name: "Alibaba", logo: "/img/alibaba.jpg", width: 150, height: 40 },
    { name: "DHL", logo: "/img/dhl.jpg", width: 110, height: 40 },
  ];

  return (
    <section className="partners-section">
      <div className="partners-container">
        <p className="partners-title">
          EN ALIANZA CON LÍDERES GLOBALES DE LOGÍSTICA Y COMERCIO
        </p>
        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.name} className="partner-logo-item">
              <Image
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                width={partner.width}
                height={partner.height}
                className="partner-logo-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}