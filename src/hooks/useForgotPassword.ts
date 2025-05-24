// hooks/useForgotPassword.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      alert("Un email de réinitialisation a été envoyé.");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("Utilisateur non trouvé.");
      } else {
        alert("Erreur lors de l'envoi de l'email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleSubmit,
  };
}
