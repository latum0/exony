import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import FournisseursPage from "@/features/fournisseurs/FournisseursPage";
import UtilisateursPage from "@/features/utilisateurs/UtilisateursPage";
import CommandesPage from "@/features/Commandes/CommandesPage";
import ListeNoirePage from "@/features/ListeNoire/ListeNoirePage";
import PrivateRoute from "@/components/PrivateRoute";
import Clients from "@/features/Clients/client";
import Produits from "@/features/Produits/produits";

export function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Routes privées */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="fournisseurs" element={<FournisseursPage />} />
          <Route path="utilisateurs" element={<UtilisateursPage />} />
          <Route path="commandes" element={<CommandesPage />} />
          <Route path="liste-noire" element={<ListeNoirePage />} />
           <Route path="client" element={<Clients />} />
          <Route path="Produits" element={<Produits />} />
        </Route>
      </Route>
    </Routes>
  );
}
