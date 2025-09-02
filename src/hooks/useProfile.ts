// src/hooks/useProfile.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/store/slices/profileSlice";
import api from "@/api/axios";
import type { RootState } from "@/store";

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export default function useProfile() {
  const dispatch = useDispatch();
  const { data, loading, error, updating, updateError } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(fetchProfileStart());

        const token = localStorage.getItem("accessToken");
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(fetchProfileSuccess(response.data.data));
      } catch (err: any) {
        console.error("Erreur récupération profil :", err);
        dispatch(
          fetchProfileFailure(err?.response?.data?.message || "Erreur serveur")
        );
      }
    };

    fetchProfile();
  }, [dispatch]);

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      dispatch(updateProfileStart());

      const token = localStorage.getItem("accessToken");
      const response = await api.patch("/auth/profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      dispatch(updateProfileSuccess(response.data));
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error("Erreur mise à jour profil :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(updateProfileFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  return {
    profile: data,
    loading,
    error,
    updating,
    updateError,
    updateProfile,
  };
}