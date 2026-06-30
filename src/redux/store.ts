import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slice/uiSlice";
import authReducer, { persistAuth } from "./slice/authSlice";
import savedReducer, { persistSaved } from "./slice/savedSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    saved: savedReducer,
  },
});

// Mirror persisted slices to localStorage whenever they change (prototype persistence).
let lastAuth = store.getState().auth;
let lastSaved = store.getState().saved.ids;
store.subscribe(() => {
  const { auth, saved } = store.getState();
  if (auth !== lastAuth) {
    lastAuth = auth;
    persistAuth(auth);
  }
  if (saved.ids !== lastSaved) {
    lastSaved = saved.ids;
    persistSaved(saved.ids);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
