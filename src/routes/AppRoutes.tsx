import { Routes, Route } from "react-router-dom"
import LoginPage from "@/features/auth/LoginPage"
import RegisterPage from "@/features/auth/RegisterPage"
import DashboardLayout from "@/layout/DashboardLayout"
import DashboardPage from "@/features/dashboard/DashboardPage"
import FournisseursPage from "@/features/fournisseurs/FournisseursPage"
import UtilisateursPage from "@/features/utilisateurs/UtilisateursPage"
import CommandesPage from "@/features/Commandes/CommandesPage"
import ListeNoirePage from "@/features/ListeNoire/ListeNoirePage"
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Pages sans layout */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Pages avec sidebar/header (layout global) */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="fournisseurs" element={<FournisseursPage />} />
        <Route path="utilisateurs" element={<UtilisateursPage />} />
        <Route path="commandes" element={<CommandesPage />} />
        <Route path="liste-noire" element={<ListeNoirePage />} />
      </Route>
    </Routes>
  )
}
