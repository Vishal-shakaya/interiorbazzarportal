import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  /** Global left sidebar open state (mobile drawer / desktop collapse). */
  sidebarOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
