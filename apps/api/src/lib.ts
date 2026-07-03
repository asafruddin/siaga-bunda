import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify } from 'jose';
import type { Context, Next } from 'hono';
import type { Role } from '@siaga/shared';

const required = (name: string) => { const value = process.env[name]; if (!value || value.includes('YOUR_')) throw new Error(`${name} is not configured`); return value; };
export const db = () => createClient(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
const secret = () => new TextEncoder().encode(required('JWT_SECRET'));
export async function issueToken(user: { id: string; role: Role }) { return new SignJWT({ role: user.role }).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('30d').sign(secret()); }
export async function auth(c: Context, next: Next) {
  try { const raw = c.req.header('authorization')?.replace(/^Bearer /i, ''); if (!raw) throw new Error(); const { payload } = await jwtVerify(raw, secret()); c.set('user', { id: payload.sub!, role: payload.role as Role }); await next(); }
  catch { return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Sesi tidak valid atau telah berakhir.' } }, 401); }
}
export const researcher = async (c: Context, next: Next) => c.get('user')?.role === 'researcher' ? next() : c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Akses khusus peneliti.' } }, 403);
export const ok = <T>(c: Context, data: T, status = 200) => c.json({ success: true, data }, status as 200);
export const fail = (c: Context, code: string, message: string, status = 400) => c.json({ success: false, error: { code, message } }, status as 400);
export const row = <T>(result: { data: T | null; error: { message: string } | null }) => { if (result.error) throw new Error(result.error.message); return result.data; };
export async function audit(action: string, userId?: string, respondentId?: string, entityId?: string, metadata: unknown = {}) { await db().from('audit_logs').insert({ action, user_id: userId, respondent_id: respondentId, entity_id: entityId, metadata }); }
