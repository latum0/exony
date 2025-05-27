import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "@/store/slices/authSlice";
import api from "@/api/axios";

export default function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (formData: { email: string; password: string }) => {
    try {
      console.log("Data envoyée :", formData);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // ✅ Sauvegarde des tokens dans localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // ✅ Sauvegarde des tokens dans Redux
      dispatch(setTokens({ accessToken, refreshToken }));

      // ✅ Redirection après connexion
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error.response?.data || error.message);
      throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return { login };
}
