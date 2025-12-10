import type { StateCreator } from 'zustand';
import type { FavoritePair } from '../../domain/conversion/types';

export interface FavoritesState {
  favorites: FavoritePair[];
  addFavorite: (f: FavoritePair) => void;
  removeFavorite: (id: string) => void;
  reorderFavorites: (idsInOrder: string[]) => void;
  moveFavoriteUp: (id: string) => void;
  moveFavoriteDown: (id: string) => void;
}

export const createFavoritesSlice: StateCreator<FavoritesState, [], [], FavoritesState> = (set) => ({
  favorites: [],
  addFavorite: (f) => set((state) => {
    // prevent duplicates
    if (state.favorites.some(x => x.fromUnitId === f.fromUnitId && x.toUnitId === f.toUnitId)) return {} as any;
    return { favorites: [...state.favorites, f] };
  }),
  removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter(x => x.id !== id) })),
  reorderFavorites: (idsInOrder) => set((state) => ({
    favorites: idsInOrder
      .map(id => state.favorites.find(f => f.id === id))
      .filter(Boolean) as FavoritePair[],
  })),
  moveFavoriteUp: (id) => set((state) => {
    const idx = state.favorites.findIndex(f => f.id === id);
    if (idx <= 0) return {} as any;
    const arr = state.favorites.slice();
    const tmp = arr[idx-1]; arr[idx-1] = arr[idx]; arr[idx] = tmp;
    return { favorites: arr };
  }),
  moveFavoriteDown: (id) => set((state) => {
    const idx = state.favorites.findIndex(f => f.id === id);
    if (idx < 0 || idx >= state.favorites.length - 1) return {} as any;
    const arr = state.favorites.slice();
    const tmp = arr[idx+1]; arr[idx+1] = arr[idx]; arr[idx] = tmp;
    return { favorites: arr };
  }),
});
