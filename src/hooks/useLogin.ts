// src/hooks/useLogin.ts
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "@/store/slices/authSlice";
import api from "@/api/axios";

export default function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (formData: { email: string; password: string }) => {
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      dispatch(setTokens({ accessToken }));

      const profileRes = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = profileRes.data.data;

      let redirectPath = "/dashboard";

      if (profile.role === "ADMIN") {
        redirectPath = "/dashboard";
      } else if (
        profile.role === "MANAGER" &&
        Array.isArray(profile.permissions)
      ) {
        if (profile.permissions.includes("AGENT_DE_STOCK")) {
          redirectPath = "/fournisseurs";
        } else if (profile.permissions.includes("CONFIRMATEUR")) {
          redirectPath = "/commandes";
        } else if (profile.permissions.includes("SAV")) {
          redirectPath = "/client";
        }
      }

      navigate(redirectPath);
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);

      let errorMessage = "Échec de la connexion. Vérifiez vos identifiants.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      throw new Error(errorMessage);
    }
  };

  return { login };
}
