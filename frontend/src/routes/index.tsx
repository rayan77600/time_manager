import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import UsersPage from '@/pages/UsersPage'
import LoginPage from '@/pages/LoginPage'
import Test from '../pages/TestPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========= Layout principal (utilisateurs, dashboard, etc.) ========= */}
      <Route element={<AppLayout />}>
        {/* <Route path="/" element={<DashboardPage />} /> */}
        <Route path="/" element={<UsersPage />} />
      </Route>

      {/* ========= Routes publiques (sans layout) ========= */}
      <Route path="/login" element={<LoginPage />} />

      {/* ========= Troisième “emplacement” : routes sécurisées Keycloak ========= */}
      <Route element={<AppLayout />}>
        <Route path="/connect" element={<Test />} />
        {/* tu peux ajouter d'autres routes protégées ici */}
      </Route>
    </Routes>
  );
}