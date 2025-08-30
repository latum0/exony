/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface StatState {
  percentage: number;
  windowCount?: number;
  totalCount?: number;
  clientCountWindow?: number;
  clientCountTotal?: number;
  retourCountWindow?: number;
  retourCountTotal?: number;
  commandeCountTotal?: number;
}

interface StatsSliceState {
  commande: StatState | null;
  client: StatState | null;
  retour: StatState | null;
  retourCommande: StatState | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsSliceState = {
  commande: null,
  client: null,
  retour: null,
  retourCommande: null,
  loading: false,
  error: null,
};

// Async thunks pour chaque stat
export const fetchCommandeStats = createAsyncThunk(
  "stats/fetchCommande",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const response = await api.get(`/statistiques/commande?${searchParams}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchClientStats = createAsyncThunk(
  "stats/fetchClient",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const response = await api.get(`/statistiques/client?${searchParams}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchRetourStats = createAsyncThunk(
  "stats/fetchRetour",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const response = await api.get(`/statistiques/retour?${searchParams}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchRetourCommandeStats = createAsyncThunk(
  "stats/fetchRetourCommande",
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const response = await api.get(
        `/statistiques/retour/commande?${searchParams}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    clearStats: (state) => {
      state.commande = null;
      state.client = null;
      state.retour = null;
      state.retourCommande = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Commande
      .addCase(fetchCommandeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommandeStats.fulfilled,
        (state, action: PayloadAction<StatState>) => {
          state.loading = false;
          state.commande = action.payload;
        }
      )
      .addCase(fetchCommandeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Client
      .addCase(fetchClientStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClientStats.fulfilled,
        (state, action: PayloadAction<StatState>) => {
          state.loading = false;
          state.client = action.payload;
        }
      )
      .addCase(fetchClientStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Retour
      .addCase(fetchRetourStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRetourStats.fulfilled,
        (state, action: PayloadAction<StatState>) => {
          state.loading = false;
          state.retour = action.payload;
        }
      )
      .addCase(fetchRetourStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Retour/Commande
      .addCase(fetchRetourCommandeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRetourCommandeStats.fulfilled,
        (state, action: PayloadAction<StatState>) => {
          state.loading = false;
          state.retourCommande = action.payload;
        }
      )
      .addCase(fetchRetourCommandeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;
