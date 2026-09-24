export function dateCN(iso:string|Date) { return new Date(iso).toLocaleDateString("zh-CN",{timeZone:"UTC",year:"numeric",month:"2-digit",day:"2-digit"}); }
export function safeUrl(url:string) { try {const p=new URL(url); return ["http:","https:"].includes(p.protocol)?p.toString():"#";} catch{return "#";} }
