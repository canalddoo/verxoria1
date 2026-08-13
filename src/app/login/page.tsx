"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales incorrectas.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Image
          src="/img/logo.png"
          alt="Logo VEXORIA"
          width={150}
          height={38}
          className="login-logo"
          priority
        />

        <h1 className="login-title">Acceso Administrador</h1>
        <p className="login-subtitle">
          Área privada para la gestión de envíos de VEXORIA.
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="admin@vexoria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            <i className="fa-solid fa-lock"></i>
            <span>{loading ? "Verificando..." : "Ingresar"}</span>
          </button>
        </form>

        <div className="login-footer-links">
          <Link href="/" className="back-link">
            <i className="fa-solid fa-arrow-left"></i> Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}