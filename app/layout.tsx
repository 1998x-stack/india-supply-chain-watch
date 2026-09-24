import type {Metadata} from "next";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {siteName,siteDescription} from "@/lib/config";
import "./globals.css";
export const metadata: Metadata={title:{default:`${siteName} | 印度产业与供应链信息平台`,template:`%s | ${siteName}`},description:siteDescription,icons:{icon:"/favicon.svg"},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><Header/><main className="min-h-[60vh]">{children}</main><Footer/></body></html>}
