import type {Metadata} from "next";
import {cookies} from "next/headers";
import {cookieName,validSession} from "@/lib/security";
import {AdminLogin,AdminReview} from "@/components/admin-console";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"内部审核台",robots:{index:false,follow:false}};
export default async function Admin(){const cookie=(await cookies()).get(cookieName)?.value;const logged=validSession(cookie);return <div className="container-page max-w-[1050px] py-12"><div className="eyebrow">EDITOR ONLY / INTERNAL</div><h1 className="mt-3 text-3xl font-black text-navy">投稿审核工作台</h1><p className="mt-3 text-sm text-[#72848d]">仅供网站编辑使用。个人联系方式、原始未经审核的内容不得复制到公共代码仓库。</p>{logged?<AdminReview/>:<AdminLogin/>}</div>}
