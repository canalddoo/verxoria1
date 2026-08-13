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

const STATUS_OPTIONS = [
  "Étiquette créée",
  "Pris en charge",
  "En transit",
  "En cours de livraison",
  "Livré",
];

export default function ColisPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // État pour la modal de détails
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  // Chargement des colis au montage
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/colis");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de charger les colis");
      }

      setPackages(data.packages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Modification du statut du colis
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/colis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      // Mise à jour de la liste locale
      setPackages((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      // Si la modale est ouverte pour ce colis, on met à jour l'objet sélectionné
      if (selectedPackage?.id === id) {
        setSelectedPackage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrage intelligent
  const filteredPackages = packages.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.trackingCode?.toLowerCase().includes(q) ||
      item.recipient?.toLowerCase().includes(q) ||
      item.destinationCity?.toLowerCase().includes(q) ||
      item.originCity?.toLowerCase().includes(q) ||
      item.packageName?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Es-tu sûr de vouloir supprimer ce colis ?")) return;

    try {
      const res = await fetch(`/api/colis?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Mise à jour de l'état local après suppression
      setPackages((prev) => prev.filter((item) => item.id !== id));
      if (selectedPackage?.id === id) setSelectedPackage(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Navbar supérieure */}
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

      {/* Navigation secondaire */}
      <nav className="dashboard-subnav">
        <div className="dashboard-subnav-container">
          <Link href="/dashboard" className="nav-tab">
            <i className="fa-solid fa-gauge-high"></i>
            <span>Panneau</span>
          </Link>
          <Link href="/dashboard/colis" className="nav-tab active">
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
            <h1>Colis</h1>
            <p>Consultez, modifiez ou supprimez les soumissions enregistrées.</p>
          </div>
          <Link href="/dashboard/nouvelle-livraison" className="btn-new-delivery">
            <i className="fa-solid fa-circle-plus"></i>
            <span>Nouvelle livraison</span>
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Recherche par code, destinataire, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Message d'erreur s'il y en a un */}
        {error && (
          <div style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</div>
        )}

        {/* Container des résultats */}
        <div className="colis-box">
          {loading ? (
            <div className="box-body-empty">Chargement des colis...</div>
          ) : filteredPackages.length === 0 ? (
            <div className="box-body-empty">Aucun envoi correspondant.</div>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="font-semibold">{pkg.trackingCode}</td>
                      <td>{pkg.packageName}</td>
                      <td>{pkg.recipient}</td>
                      <td>{`${pkg.destinationCity}, ${pkg.destinationCountry}`}</td>
                      <td>
                        <select
                          value={pkg.status}
                          disabled={updatingId === pkg.id}
                          onChange={(e) => handleStatusChange(pkg.id, e.target.value)}
                          style={{
                            padding: "0.3rem 0.6rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "#f8fafc",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn-action"
                          title="Voir les détails"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn-action btn-delete"
                          title="Supprimer le colis"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Pop-up Modal : Détails du colis */}
      {selectedPackage && (
        <div className="modal-overlay">
          <div className="modal-card modal-details">
            <div className="modal-header">
              <h2>Détails du Colis</h2>
              <button
                className="btn-close-modal"
                onClick={() => setSelectedPackage(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="details-body">
              <div className="detail-item">
                <span className="detail-label">Code de suivi</span>
                <span className="detail-value tracking-code">
                  {selectedPackage.trackingCode}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Nom du paquet</span>
                <span className="detail-value">{selectedPackage.packageName}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Destinataire</span>
                <span className="detail-value">{selectedPackage.recipient}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Origine</span>
                <span className="detail-value">
                  {selectedPackage.originCity}, {selectedPackage.originCountry}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Destination</span>
                <span className="detail-value">
                  {selectedPackage.destinationCity}, {selectedPackage.destinationCountry}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Statut actuel</span>
                <select
                  value={selectedPackage.status}
                  disabled={updatingId === selectedPackage.id}
                  onChange={(e) =>
                    handleStatusChange(selectedPackage.id, e.target.value)
                  }
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="detail-item">
                <span className="detail-label">Date d'enregistrement</span>
                <span className="detail-value">
                  {new Date(selectedPackage.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPackage(null)}
              className="btn-submit width-full margin-top-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}