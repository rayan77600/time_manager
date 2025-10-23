import Keycloak from 'keycloak-js'

const KEYCLOAK_CONFIG = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

for (const [key, value] of Object.entries(KEYCLOAK_CONFIG)) {
  if (!value) {
    console.warn(`[Keycloak] ⚠️ Missing environment variable: ${key}`)
  }
}

const keycloak = new Keycloak(KEYCLOAK_CONFIG)

export default keycloak
