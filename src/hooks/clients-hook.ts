import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import type { ClientFormValues } from "@/components/clients/add-form";

interface UpdateClientPayload {
  id: number;
  data: ClientFormValues;
}

export const createClient = createAsyncThunk(
  "clients/create",
  async (client: ClientFormValues, { rejectWithValue }) => {
    try {
      const response = await api.post("/clients", client);

      const serverMsg = response.data?.message;

      let userMessage: string | null = null;

      if (serverMsg?.includes("Client_email_key")) {
        userMessage = "Un client avec cet email existe déjà.";
      } else if (serverMsg?.includes("Client_numeroTelephone_key")) {
        userMessage = "Un client avec ce numéro de téléphone existe déjà.";
      }

      if (userMessage) {
        return rejectWithValue({
          status: 409,
          message: userMessage,
        });
      }

      return response.data;
    } catch (err: any) {
      return rejectWithValue({
        status: err?.response?.status ?? 500,
        message:
          err?.response?.data?.message ?? "Une erreur inconnue est survenue.",
      });
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/update",
  async ({ id, data }: UpdateClientPayload) => {
    const response = await api.patch(`/clients/${id}`, data);

    return response.data;
  }
);
export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (params?: { page?: number; perPage?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.perPage)
      searchParams.append("perPage", params.perPage.toString());
    if (params?.search) searchParams.append("search", params.search);

    const response = await api.get(`/clients?${searchParams.toString()}`);

    return response.data.data;
  }
);
export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id: number) => {
    const response = await api.delete(`/clients/${id}`);

    return response.data;
  }
);
export const addToBlacklist = createAsyncThunk(
  "clients/addToBlacklist",
  async (clientId: number) => {
    const response = await api.patch(`/clients/addBlacklist/${clientId}`);
    return response.data;
  }
);
