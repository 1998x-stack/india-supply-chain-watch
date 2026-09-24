export const siteName = "印链观察";
export const siteDescription = "面向中国企业的印度产业情报、供应链政策与跨境合作经验共享平台。";
export const canAccept = () => Boolean(process.env.DATABASE_URL && process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32 && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16 && process.env.NEXT_PUBLIC_CONTACT_EMAIL);
export const categories = ["产业政策", "PCB / PCBA", "半导体", "服务器与电子制造", "贸易与合规", "企业经验"] as const;
export const reportCategories = ["订单与付款", "技术合作与保密", "供应链履约", "跨境投资与招商", "贸易与合规", "其他"] as const;
