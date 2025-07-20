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
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      if (status === 409) {
        if (serverMsg.includes("Client_email_key")) {
          return rejectWithValue("Un client avec cet email existe déjà.");
        }
        if (serverMsg.includes("Client_numeroTelephone_key")) {
          return rejectWithValue(
            "Un client avec ce numéro de téléphone existe déjà."
          );
        }
      }

      return rejectWithValue("Une erreur inconnue est survenue.");
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/update",
  async ({ id, data }: UpdateClientPayload) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  }
);
export const fetchClients = createAsyncThunk("clients/fetchAll", async () => {
  const response = await api.get("/clients");

  return response.data.data;
});
