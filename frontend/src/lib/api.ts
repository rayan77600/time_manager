import keycloak from "@/auth/keycloak" // adapte le chemin selon ton projet

const API_BASE = "/api" // correspond à ton backend exposé via Nginx

// 🔹 Renouvelle le token Keycloak s'il expire bientôt
async function ensureFreshToken(minValiditySeconds = 30) {
  try {
    const refreshed = await keycloak.updateToken(minValiditySeconds)
    if (refreshed) {
      localStorage.setItem("kc_token", keycloak.token!)
    }
  } catch (err) {
    console.warn("[Keycloak] Token refresh failed:", err)
  }
}

// 🔹 fetch() sécurisé avec Bearer token
async function authFetch(input: string, init: RequestInit = {}) {
  // 1️⃣ S'assure que le token est encore valide
  await ensureFreshToken(30)

  // 2️⃣ Récupère le token depuis Keycloak ou localStorage
  const token = keycloak.token || localStorage.getItem("kc_token")
  const headers = new Headers(init.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  headers.set("Content-Type", "application/json")

  // 3️⃣ Envoie la requête
  const response = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
  })

  // 4️⃣ Si le token est expiré ou invalide, on peut tenter un refresh
  if (response.status === 401) {
    console.warn("[API] 401 Unauthorized — maybe token expired.")
  }

  return response
}

// 🔹 Fonctions pratiques pour les requêtes
export const api = {
  get: (url: string) => authFetch(url, { method: "GET" }),
  post: (url: string, body?: any) =>
    authFetch(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body?: any) =>
    authFetch(url, { method: "PUT", body: JSON.stringify(body) }),
  del: (url: string) => authFetch(url, { method: "DELETE" }),
}

export default api