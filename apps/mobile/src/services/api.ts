import { useSession } from './session';
const BASE = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
if (!BASE) console.warn('EXPO_PUBLIC_API_BASE_URL is not configured');
export class ApiError extends Error { constructor(public code: string, message: string, public status: number) { super(message); } }
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useSession.getState().token; const response = await fetch(`${BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } });
  const body = await response.json().catch(() => null); if (!response.ok || !body?.success) throw new ApiError(body?.error?.code ?? 'NETWORK_ERROR', body?.error?.message ?? 'Tidak dapat terhubung ke server.', response.status); return body.data;
}
export const post = <T>(path: string, body?: unknown) => api<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
export const put = <T>(path: string, body: unknown) => api<T>(path, { method: 'PUT', body: JSON.stringify(body) });
