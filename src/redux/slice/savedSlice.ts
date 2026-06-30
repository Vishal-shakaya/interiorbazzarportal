import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/** Saved/bookmarked listing ids. Mirrored to localStorage (prototype). */
const STORAGE_KEY = "ib_saved";

function hydrate(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

const savedSlice = createSlice({
  name: "saved",
  initialState: { ids: hydrate() as string[] },
  reducers: {
    toggleSaved(state, action: PayloadAction<string>) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.unshift(id);
    },
  },
});

export const { toggleSaved } = savedSlice.actions;
export default savedSlice.reducer;

export function persistSaved(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export const selectSavedIds = (s: RootState) => s.saved.ids;
export const selectIsSaved = (id: string) => (s: RootState) => s.saved.ids.includes(id);
