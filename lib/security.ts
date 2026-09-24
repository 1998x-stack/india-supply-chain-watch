import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const cookieName = "iscw_admin";
export { cookieName };
function constantEqual(a: string, b: string) {
  const x = Buffer.from(a); const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x,y);
}
export function secretReady() { return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32); }
export function validPassword(value: string) {
  if (!secretReady()) return false;
  return constantEqual(createHash("sha256").update(value).digest("hex"),createHash("sha256").update(process.env.ADMIN_PASSWORD!).digest("hex"));
}
function signature(expiry: number) {
  return createHmac("sha256",process.env.SESSION_SECRET!).update(`iscw-admin:${expiry}`).digest("hex");
}
export function newSession() {
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  return `${expiry}.${signature(expiry)}`;
}
export function validSession(cookie?: string) {
  if (!cookie || !secretReady()) return false;
  const [stamp,sig,...rest]=cookie.split(".");
  if (rest.length || !/^\d{13}$/.test(stamp) || !sig) return false;
  const expiry=Number(stamp);
  return expiry>Date.now() && expiry<Date.now()+25*60*60*1000 && constantEqual(sig,signature(expiry));
}
export function requestIsAdmin(request: NextRequest) { return validSession(request.cookies.get(cookieName)?.value); }
export function sameOrigin(request: NextRequest) {
  const origin=request.headers.get("origin");const host=request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const parsed=new URL(origin);
    return parsed.host===host && (parsed.protocol==="https:" || (parsed.protocol==="http:" && ["localhost","127.0.0.1"].includes(parsed.hostname)));
  } catch { return false; }
}
export function ipDigest(ip: string) { return createHmac("sha256",process.env.SESSION_SECRET!).update(`ip:${ip}`).digest("hex"); }
