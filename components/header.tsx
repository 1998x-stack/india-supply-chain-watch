"use client";
import Link from "next/link";
import {Menu, X, ArrowUpRight, ScanSearch, TrendingUp, Search} from "lucide-react";
import {useState} from "react";
const nav=[{href:"/",name:"Trending 趋势"},{href:"/insights",name:"情报库"},{href:"/projects",name:"项目台账"},{href:"/dossiers",name:"专题研究"},{href:"/sources",name:"原始来源"},{href:"/submissions",name:"合作经验"},{href:"/about",name:"关于"}];
export function Header(){
  const [open,setOpen]=useState(false);
  return <header className="sticky top-0 z-40 bg-[#24292f] text-white">
    <div className="container-page flex h-[64px] items-center justify-between gap-4">
      <Link href="/" className="group flex shrink-0 items-center gap-2" onClick={()=>setOpen(false)} aria-label="印链观察趋势首页"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#65717b] bg-[#30363d] text-white"><ScanSearch size={21}/></span><span className="text-[15px] font-bold tracking-wide sm:text-[17px]">印链观察<span className="text-[#9da7b0]"> / Trending</span></span></Link>
      <nav className="hidden items-center gap-5 xl:flex" aria-label="主导航">{nav.map(n=><Link key={n.href} href={n.href} className="text-[12px] font-semibold text-[#e4e7eb] hover:text-white hover:underline">{n.name}</Link>)}</nav>
      <div className="hidden xl:flex items-center gap-3"><Link className="inline-flex items-center gap-1 rounded-md border border-[#65717b] px-3 py-1.5 text-xs font-semibold hover:border-white" href="/insights"><Search size={13}/>搜索</Link><Link className="inline-flex items-center gap-1 rounded-md bg-[#238636] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2ea043]" href="/submit">分享经验 <ArrowUpRight size={13}/></Link></div>
      <button type="button" className="rounded-md border border-[#65717b] p-2 xl:hidden" onClick={()=>setOpen(!open)} aria-label={open?"关闭导航":"打开导航"}>{open?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
    {open&&<nav className="container-page flex flex-col gap-1 border-t border-[#57606a] pb-4 pt-2 xl:hidden" aria-label="移动端导航">{nav.map(n=><Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-[#30363d]">{n.name}</Link>)}<Link href="/submit" onClick={()=>setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#238636] px-3 py-2 text-sm font-bold">分享经验 <ArrowUpRight size={14}/></Link></nav>}
  </header>;
}
