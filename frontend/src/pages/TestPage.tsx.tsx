import React, { useEffect, useState } from "react";
import Keycloak from "keycloak-js";

// 🧱 Instance globale (évite de la recréer à chaque rendu)
const keycloak = new Keycloak({
  url: "http://localhost:4000/auth", // ✅ Pas besoin du slash final
  realm: "master",
  clientId: "100",
});

export default function LoginPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const isAuth = await keycloak.init({
          onLoad: "check-sso", // ou "login-required" pour forcer la redirection directe
          pkceMethod: "S256",  // sécurisation recommandée
        });

        setAuthenticated(isAuth);
      } catch (err) {
        console.error("❌ Keycloak init failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + "/connect",
    });
  };

  const handleLogout = async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin + "/connect",
      });
      setAuthenticated(false);
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Chargement...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      {!authenticated ? (
        <>
          <h2>Bienvenue 👋</h2>
          <button onClick={handleLogin}>Se connecter via Keycloak</button>
        </>
      ) : (
        <>
          <h2>Connecté ✅</h2>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      )}
    </div>
  );
}
