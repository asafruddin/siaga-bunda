import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { Role } from '@siaga/shared';

const TOKEN_KEY = 'siaga_session';
type SessionState = { token: string | null; role: Role | null; hydrated: boolean; hydrate(): Promise<void>; signIn(token: string, role: Role): Promise<void>; signOut(): Promise<void> };
export const useSession = create<SessionState>((set) => ({
  token: null, role: null, hydrated: false,
  hydrate: async () => { const raw = await SecureStore.getItemAsync(TOKEN_KEY); try { const session = raw ? JSON.parse(raw) : {}; set({ token: session.token ?? null, role: session.role ?? null, hydrated: true }); } catch { await SecureStore.deleteItemAsync(TOKEN_KEY); set({ token: null, role: null, hydrated: true }); } },
  signIn: async (token, role) => { await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({ token, role })); set({ token, role }); },
  signOut: async () => { await SecureStore.deleteItemAsync(TOKEN_KEY); set({ token: null, role: null }); }
}));
