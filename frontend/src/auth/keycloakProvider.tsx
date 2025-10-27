/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react'
import keycloak from './keycloak'
import { api } from '@/lib/api' // ✅ AJOUT: wrapper fetch avec Bearer token

async function loadUsers() {
  const res = await api.get('/users/')
  if (!res.ok) {
    console.warn('[API] /users/ error:', res.status)
    const txt = await res.text().catch(() => '')
    console.warn('[API] body:', txt)
    return
  }
  const users = await res.json()
  console.log('👤 Users:', users)
}

interface AuthContextType {
  keycloak: Keycloak.KeycloakInstance
  authenticated: boolean
  initialized: boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  keycloak,
  authenticated: false,
  initialized: false,
  logout: () => {},
})

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((auth) => {
        setAuthenticated(auth)
        setInitialized(true)
        if (auth && keycloak.token) {
          localStorage.setItem('kc_token', keycloak.token)
          console.log('✅ Token complet :', keycloak.token)
          console.log('🧩 Token décodé :', keycloak.tokenParsed)

          // 🔹 AJOUT : envoie le token au backend pour créer le cookie de session
          fetch("http://localhost:4000/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ✅ indispensable pour envoyer/recevoir les cookies
            body: JSON.stringify({ token: keycloak.token }),
          })
            .then(res => res.json())
            .then(data => console.log("🍪 Session créée côté backend :", data))
            .catch(err => console.error("Erreur création session :", err))
        }
      })
      .catch((err) => {
        console.error('[Keycloak] Init error', err)
        setInitialized(true)
      })
  }, [])

  // ✅ AJOUT : tester l’API seulement après authentification
  useEffect(() => {
    if (initialized && authenticated) {
      loadUsers()
    }
  }, [initialized, authenticated])

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    try {
      keycloak.logout({ redirectUri: window.location.origin })
    } catch (e) {
      console.warn('Erreur lors du logout Keycloak:', e)
    }
    setAuthenticated(false)
  }

  if (!initialized) {
    // 🔄 version stylée
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold animate-pulse">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ keycloak, authenticated, initialized, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
