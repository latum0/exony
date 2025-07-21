import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/usersSlice";
import profileReducer from "./slices/profileSlice";
import clientsReducer from "./slices/clients-slice";
import blacklistClientsReducer from "./slices/blacklist-slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    profile: profileReducer,
    clients: clientsReducer,
    blacklistClients: blacklistClientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
