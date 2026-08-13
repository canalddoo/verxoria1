"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

interface PackageItem {
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

interface StatsData {
  total: number;
  enMouvement: number;
  livres: number;
  etiquettesCrees: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    enMouvement: 0,
    livres: 0,
    etiquettesCrees: 0,
  });
  const [recentPackages, setRecentPackages] = useState<PackageItem[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/colis/stats");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur chargement des analytics");
      }

      setStats(data.stats);
      setRecentPackages(data.recentPackages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-navbar">
        <div className="dashboard-nav-container">
          <Image
            src="/img/logo.png"
            alt="VEXORIA"
            width={140}
            height={34}
            priority
          />
          <div className="dashboard-nav-right">
            <span className="badge-private">
              {session?.user?.email || "Espace Privé"}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sortir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Onglets sous le header */}
      <nav className="dashboard-subnav">
        <div className="dashboard-subnav-container">
          <Link href="/dashboard" className="nav-tab active">
            <i className="fa-solid fa-gauge-high"></i>
            <span>Panneau</span>
          </Link>
          <Link href="/dashboard/colis" className="nav-tab">
            <i className="fa-solid fa-boxes-stacked"></i>
            <span>Colis</span>
          </Link>
          <Link href="/dashboard/nouvelle-livraison" className="nav-tab">
            <i className="fa-solid fa-circle-plus"></i>
            <span>Nouvelle livraison</span>
          </Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        <div className="dashboard-header-row">
          <div className="dashboard-title-group">
            <h1>Panneau de contrôle</h1>
            <p>Résumé des activités d'expédition de VEXORIA.</p>
          </div>
          <Link href="/dashboard/nouvelle-livraison" className="btn-new-delivery">
            <i className="fa-solid fa-circle-plus"></i>
            <span>Nouvelle livraison</span>
          </Link>
        </div>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</div>
        )}

        {/* Grille des statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Expéditions totales</span>
              <i className="fa-solid fa-boxes-stacked stat-icon purple"></i>
            </div>
            <div className="stat-value">{loading ? "..." : stats.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">En mouvement</span>
              <i className="fa-solid fa-truck-fast stat-icon orange"></i>
            </div>
            <div className="stat-value">{loading ? "..." : stats.enMouvement}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Livré</span>
              <i className="fa-solid fa-circle-check stat-icon green"></i>
            </div>
            <div className="stat-value">{loading ? "..." : stats.livres}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">Étiquettes créées</span>
              <i className="fa-solid fa-file-invoice stat-icon blue"></i>
            </div>
            <div className="stat-value">{loading ? "..." : stats.etiquettesCrees}</div>
          </div>
        </div>

        {/* Section dernières livraisons */}
        <div className="recent-deliveries-box">
          <div className="box-header">
            <h3>Dernières livraisons</h3>
            <Link href="/dashboard/colis" className="btn-see-all">
              Afficher tout
            </Link>
          </div>

          {loading ? (
            <div className="box-body-empty">Chargement des données...</div>
          ) : recentPackages.length === 0 ? (
            <div className="box-body-empty">
              Aucun envoi n'a encore été enregistré.
            </div>
          ) : (
            <div className="colis-table-wrapper">
              <table className="colis-table">
                <thead>
                  <tr>
                    <th>Code de suivi</th>
                    <th>Nom du paquet</th>
                    <th>Destinataire</th>
                    <th>Destination</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPackages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="font-semibold">{pkg.trackingCode}</td>
                      <td>{pkg.packageName}</td>
                      <td>{pkg.recipient}</td>
                      <td>{`${pkg.destinationCity}, ${pkg.destinationCountry}`}</td>
                      <td>
                        <span className="status-badge-tag">{pkg.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}