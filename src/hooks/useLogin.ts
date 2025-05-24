import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "@/store/slices/authSlice";
import api from "@/api/axios";

export default function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (formData) => {
    try {
      console.log("Data envoyée :", formData);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, user } = response.data;
      dispatch(setTokens({ accessToken, user }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return { login };
}
