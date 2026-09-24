export function siteUrl(): string {
 const configured=process.env.NEXT_PUBLIC_SITE_URL?.trim();
 const raw=configured || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
 try { const u=new URL(raw); if(!["https:","http:"].includes(u.protocol)) throw Error("invalid protocol"); return u.origin; }
 catch { return "http://localhost:3000"; }
}
