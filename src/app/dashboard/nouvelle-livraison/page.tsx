"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NouvelleLivraisonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // État du code généré pour la modal de confirmation
  const [createdTrackingCode, setCreatedTrackingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    packageName: "",
    recipient: "",
    originCountry: "",
    originCity: "",
    destinationCountry: "",
    destinationCity: "",
    status: "Étiquette créée",
  });

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/colis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      // Afficher le code de suivi généré
      setCreatedTrackingCode(data.package.trackingCode);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdTrackingCode) {
      navigator.clipboard.writeText(createdTrackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

      {/* Navigation secondaire */}
      <nav className="dashboard-subnav">
        <div className="dashboard-subnav-container">
          <Link href="/dashboard" className="nav-tab">
            <i className="fa-solid fa-gauge-high"></i>
            <span>Panneau</span>
          </Link>
          <Link href="/dashboard/colis" className="nav-tab">
            <i className="fa-solid fa-boxes-stacked"></i>
            <span>Colis</span>
          </Link>
          <Link href="/dashboard/nouvelle-livraison" className="nav-tab active">
            <i className="fa-solid fa-circle-plus"></i>
            <span>Nouvelle livraison</span>
          </Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        <div className="dashboard-header-row">
          <div className="dashboard-title-group">
            <h1>Nouvelle livraison</h1>
            <p>
              Le numéro de suivi VEX est généré automatiquement lors de
              l'enregistrement.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div style={{ color: "#ef4444", marginBottom: "1rem", fontWeight: 500 }}>
            {errorMessage}
          </div>
        )}

        {/* Formulaire de création */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Ligne 1 */}
              <div className="form-group">
                <label htmlFor="packageName">Nom du paquet</label>
                <input
                  type="text"
                  id="packageName"
                  name="packageName"
                  placeholder="Boîte à documents"
                  value={formData.packageName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipient">Destinataire</label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  placeholder="María López"
                  value={formData.recipient}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Ligne 2 */}
              <div className="form-group">
                <label htmlFor="originCountry">Pays d'origine</label>
                <input
                  type="text"
                  id="originCountry"
                  name="originCountry"
                  placeholder="Espagne"
                  value={formData.originCountry}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="originCity">Ville d'origine</label>
                <input
                  type="text"
                  id="originCity"
                  name="originCity"
                  placeholder="Madrid"
                  value={formData.originCity}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Ligne 3 */}
              <div className="form-group">
                <label htmlFor="destinationCountry">Pays de destination</label>
                <input
                  type="text"
                  id="destinationCountry"
                  name="destinationCountry"
                  placeholder="Mexique"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destinationCity">Ville de destination</label>
                <input
                  type="text"
                  id="destinationCity"
                  name="destinationCity"
                  placeholder="Guadalajara"
                  value={formData.destinationCity}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">État actuel</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="Étiquette créée">Étiquette créée</option>
                  <option value="Pris en charge">Pris en charge</option>
                  <option value="En transit">En transit</option>
                  <option value="En cours de livraison">
                    En cours de livraison
                  </option>
                  <option value="Livré">Livré</option>
                  <option value="Incident / Retardé">Incident / Retardé</option>
                </select>
              </div>
            </div>

            {/* Bouton de création */}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                <i className="fa-solid fa-floppy-disk"></i>
                <span>{loading ? "Enregistrement..." : "Créer un envoi"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Pop-up de confirmation avec Code de Suivi Copiable */}
      {createdTrackingCode && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Colis enregistré !</h2>
            <p>Voici le numéro de suivi généré pour cet envoi :</p>

            <div className="tracking-code-box">
              <span>{createdTrackingCode}</span>
              <button onClick={copyToClipboard} className="btn-copy">
                <i
                  className={
                    copied ? "fa-solid fa-check" : "fa-solid fa-copy"
                  }
                ></i>
                <span>{copied ? "Copié !" : "Copier"}</span>
              </button>
            </div>

            <button
              onClick={() => router.push("/dashboard/colis")}
              className="btn-submit width-full"
            >
              Voir la liste des colis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}