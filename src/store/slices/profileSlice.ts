// src/store/slices/profileSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export type Permission = "AGENT_DE_STOCK" | "CONFIRMATEUR" | "SAV";

interface Profile {
  id: number;
  email: string;
  phone: string;
  role: string;
  permissions: Permission[];
  name: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  data: Profile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess(state, action: PayloadAction<Profile>) {
      state.loading = false;
      state.data = action.payload;

      state.error = null;
    },
    fetchProfileFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.data = null;
    },
    updateProfileStart(state) {
      state.updating = true;
      state.updateError = null;
    },
    updateProfileSuccess(state, action: PayloadAction<Profile>) {
      state.updating = false;
      state.data = action.payload;
      state.updateError = null;
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.updating = false;
      state.updateError = action.payload;
    },
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.updating = false;
      state.updateError = null;
    },
    clearProfileErrors(state) {
      state.error = null;
      state.updateError = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfile,
  clearProfileErrors,
} = profileSlice.actions;

export default profileSlice.reducer;
