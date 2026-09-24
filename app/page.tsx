import type { Metadata } from "next";
import { TrendingBoard, type TrendParams } from "@/components/trending-board";
export const metadata: Metadata = { title: "印度产业趋势 · Trending", description: "以 GitHub Trending 风格浏览印度 PCB、半导体、电子制造与跨境投资公开资讯；原始来源可追溯。" };
export default async function Home({searchParams}:{searchParams:Promise<TrendParams>}){return <TrendingBoard params={await searchParams}/>;}
