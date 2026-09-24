import Link from "next/link";
import { ArrowUpRight, CalendarClock, ChevronDown, ExternalLink, FileCheck2, Filter, Globe2, GitBranch, GitFork, Info, Layers3, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { articles } from "@/data/articles";
import { dossiers } from "@/data/dossiers";
import type { Article } from "@/lib/types";

const INDUSTRIES = ["全部", "产业政策", "PCB / PCBA", "半导体", "服务器与电子制造", "贸易与合规"] as const;
const WINDOWS = [
  {key:"day", label:"今日", days:1},
  {key:"week", label:"本周", days:7},
  {key:"month", label:"本月", days:30},
  {key:"year", label:"近一年", days:365},
  {key:"all", label:"全部时间", days:Infinity},
] as const;
type WindowKey = (typeof WINDOWS)[number]["key"];
export type TrendParams = {since?:string; category?:string; q?:string; sort?:string};
const isoDay = (s:string) => /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
// 以内容已知的核验日期为快照截点，避免把停止更新的静态站点伪装成实时新闻源。
const snapshot = articles.reduce((latest, a) => isoDay(a.checkedAt) > latest ? a.checkedAt : latest, "2026-09-24");
const asUtc = (s:string) => new Date(`${s}T00:00:00Z`).getTime();
const DAY = 86_400_000;
const dateInWindow = (a:Article,days:number) => days===Infinity || (asUtc(snapshot)-asUtc(a.publishedAt)>=0 && asUtc(snapshot)-asUtc(a.publishedAt)<days*DAY);
const categoriesCount = INDUSTRIES.slice(1).map(category=>({category,count:articles.filter(a=>a.category===category).length}));
function urlFor(p:{since:string;category:string;q:string;sort:string}){const query=new URLSearchParams();if(p.since!=="all")query.set("since",p.since);if(p.category!=="全部")query.set("category",p.category);if(p.q)query.set("q",p.q);if(p.sort!=="newest")query.set("sort",p.sort);const qs=query.toString();return `/${qs?`?${qs}`:""}`;}
const dateText=(s:string)=>s.replaceAll("-",".");

function TrendRow({a,index}:{a:Article;index:number}){
  return <article className="trend-row group" data-testid="trend-row">
    <div className="flex items-start gap-3 sm:gap-4">
      <span className="mt-0.5 w-6 shrink-0 text-right text-sm font-bold tabular-nums text-[#8a929d]">{String(index+1).padStart(2,"0")}</span>
      <div className="mt-1 shrink-0 rounded-md border border-[#d8dee4] bg-[#f6f8fa] p-2 text-[#57606a]"><GitBranch size={18}/></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/insights/${a.slug}`} className="break-words text-[15px] font-bold leading-6 text-[#0969da] hover:underline sm:text-[17px]">{a.title}</Link>
          <span className="rounded-full border border-[#d0d7de] px-2 py-0.5 text-[10px] font-semibold text-[#57606a]">原始来源可核对</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-6 text-[#57606a]">{a.excerpt}</p>
        <p className="mt-2 text-[12px] leading-6 text-[#57606a]"><span className="font-semibold text-[#24292f]">企业关注：</span>{a.takeaway}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#57606a]">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#1f883d]"/>{a.category}</span>
          <span className="inline-flex items-center gap-1"><CalendarClock size={13}/>发布 {dateText(a.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><FileCheck2 size={13}/>{a.kind}</span>
          <span className="truncate">{a.sourceLabel}</span>
        </div>
      </div>
    </div>
    <div className="ml-9 mt-3 flex gap-2 sm:ml-10">
      <Link href={`/insights/${a.slug}`} className="trend-mini-btn">查看解读 <ArrowUpRight size={12}/></Link>
      <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="trend-mini-btn">原始资料 <ExternalLink size={12}/></a>
    </div>
  </article>;
}

export function TrendingBoard({params}:{params:TrendParams}){
  const since=WINDOWS.some(w=>w.key===params.since)?params.since as WindowKey:"all";
  const category=INDUSTRIES.includes(params.category as typeof INDUSTRIES[number])?params.category!:"全部";
  const q=(params.q??"").trim().slice(0,70);
  const sort=params.sort==="oldest"?"oldest":"newest";
  const window=WINDOWS.find(w=>w.key===since)!;
  const filtered=articles.filter(a=>dateInWindow(a,window.days)&&(category==="全部"||a.category===category)&&(!q||`${a.title} ${a.excerpt} ${a.takeaway} ${a.tags.join(" ")} ${a.sourceLabel}`.toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>sort==="oldest"?a.publishedAt.localeCompare(b.publishedAt)||a.slug.localeCompare(b.slug):b.publishedAt.localeCompare(a.publishedAt)||a.slug.localeCompare(b.slug));
  const latest=articles.slice().sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt))[0];
  return <>
    <section className="border-b border-[#d8dee4] bg-[#f6f8fa]">
      <div className="container-page py-9 sm:py-12">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#57606a]"><TrendingUp size={15} className="text-[#0969da]"/> INDIA INDUSTRY / PUBLIC INTELLIGENCE <span className="rounded-full bg-[#ddf4ff] px-2 py-0.5 text-[#0969da]">PUBLIC BETA</span></div>
        <h1 className="mt-2 text-[30px] font-bold tracking-tight text-[#24292f] sm:text-[38px]">印度产业趋势 <span className="text-[#6e7781]">/ Trending</span></h1>
        <p className="mt-2 max-w-[850px] text-[14px] leading-7 text-[#57606a]">追踪印度电子制造、PCB、半导体及跨境贸易的公开动态。参考 GitHub Trending 的快速浏览与分类方式，用可核查的来源代替未经证实的传闻。</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#57606a]"><span className="flex items-center gap-1"><ShieldCheck size={14}/>来源可追溯</span><span className="flex items-center gap-1"><Layers3 size={14}/>{articles.length} 条公开资料</span><span className="flex items-center gap-1"><CalendarClock size={14}/>数据快照 {snapshot}</span></div>
      </div>
    </section>
    <div className="container-page py-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-[#d8dee4] pb-4 text-[13px]">
        <Link href="/" className="inline-flex items-center gap-2 border-b-2 border-[#fd8c73] px-1 pb-2 font-bold text-[#24292f]"><TrendingUp size={16}/>趋势</Link>
        <Link href="/projects" className="inline-flex items-center gap-2 px-1 pb-2 font-semibold text-[#57606a] hover:text-[#0969da]"><GitFork size={16}/>项目台账</Link>
        <Link href="/dossiers" className="inline-flex items-center gap-2 px-1 pb-2 font-semibold text-[#57606a] hover:text-[#0969da]"><Layers3 size={16}/>专题</Link>
        <Link href="/submit" className="ml-auto inline-flex items-center gap-2 rounded-md border border-[#d0d7de] bg-white px-3 py-1.5 font-semibold text-[#24292f] hover:bg-[#f6f8fa]">分享合作经验 <ArrowUpRight size={13}/></Link>
      </div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_255px]">
        <div className="min-w-0">
          <form action="/" className="mb-3 flex flex-wrap items-center gap-2" aria-label="情报筛选">
            <div className="relative min-w-[190px] flex-[2] sm:min-w-[260px]"><Search size={16} className="pointer-events-none absolute left-3 top-2.5 text-[#57606a]"/><input className="trend-input pl-9" name="q" placeholder="搜索 ECMS、PCB、技术合作…" defaultValue={q} maxLength={70} aria-label="搜索关键词"/></div>
            <div className="relative flex-1"><select name="category" defaultValue={category} className="trend-input appearance-none pr-8" aria-label="按行业筛选">{INDUSTRIES.map(c=><option value={c} key={c}>{c}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-3 text-[#57606a]"/></div>
            <div className="relative flex-1"><select name="since" defaultValue={since} className="trend-input appearance-none pr-8" aria-label="按时间筛选">{WINDOWS.map(w=><option value={w.key} key={w.key}>{w.label}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-3 text-[#57606a]"/></div>
            <div className="relative flex-1"><select name="sort" defaultValue={sort} className="trend-input appearance-none pr-8" aria-label="排序方式"><option value="newest">最新发布</option><option value="oldest">最早发布</option></select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-3 text-[#57606a]"/></div>
            <button type="submit" className="trend-action"><Filter size={14}/>筛选</button>
          </form>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[#57606a]"><span className="font-bold text-[#24292f]">{filtered.length} 条公开情报</span><span>·</span><span>{window.label}（按资料发布日期，截止 {snapshot}）</span>{(since!=="all"||category!=="全部"||q||sort!=="newest")&&<Link href="/" className="ml-auto text-[#0969da] hover:underline">清除筛选</Link>}</div>
          <div className="overflow-hidden rounded-md border border-[#d0d7de] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d8dee4] bg-[#f6f8fa] px-4 py-3"><span className="flex items-center gap-2 text-[13px] font-semibold text-[#24292f]"><TrendingUp size={16}/> 最新动向</span><span className="text-[11px] text-[#57606a]">资料索引 · 非流量热度榜</span></div>
            {filtered.length?filtered.map((a,index)=><TrendRow a={a} index={index} key={a.slug}/>):<div className="px-6 py-12 text-center"><Info size={26} className="mx-auto text-[#8c959f]"/><h2 className="mt-3 font-semibold">当前筛选下暂无资料</h2><p className="mt-2 text-[13px] leading-6 text-[#57606a]">这是静态内容库，并非实时抓取。可选择“全部时间”或其他行业查看历史记录。</p><Link href="/" className="mt-4 inline-block text-[13px] font-semibold text-[#0969da] hover:underline">查看全部资料</Link></div>}
          </div>
          <p className="mt-4 flex gap-2 text-xs leading-6 text-[#57606a]"><Info size={15} className="mt-1 shrink-0"/>本榜单按公开资料的发布日期排序，不代表传播热度、企业信用分或实时趋势；资料内容应以原文及后续公告为准。</p>
        </div>
        <aside className="space-y-6" aria-label="行业分类与精选资料">
          <section className="rounded-md border border-[#d0d7de] bg-white p-4"><h2 className="text-[14px] font-bold text-[#24292f]">热门领域 <span className="text-[11px] font-normal text-[#57606a]">/ Topics</span></h2><p className="mt-1 text-[11px] leading-5 text-[#57606a]">按已收录资料数量展示，不代表全行业热度。</p><div className="mt-3 space-y-1">{categoriesCount.map(x=><Link key={x.category} href={urlFor({since:"all",category:x.category,q:"",sort:"newest"})} className="flex items-center justify-between gap-2 rounded-md px-2 py-2 text-[12px] hover:bg-[#f6f8fa]"><span className="truncate font-semibold text-[#0969da]">{x.category}</span><span className="rounded-full bg-[#eff2f5] px-2 py-0.5 text-[#57606a]">{x.count}</span></Link>)}</div></section>
          <section className="rounded-md border border-[#d0d7de] bg-white p-4"><h2 className="text-[14px] font-bold">精选专题 <span className="text-[11px] font-normal text-[#57606a]">/ Collections</span></h2><div className="mt-3 space-y-3">{dossiers.map(d=><Link key={d.slug} href={`/dossiers/${d.slug}`} className="block border-b border-[#eaeef2] pb-3 text-[12px] leading-5 text-[#0969da] hover:underline last:border-b-0 last:pb-0">{d.title}</Link>)}</div></section>
          <section className="rounded-md border border-[#d0d7de] bg-white p-4"><h2 className="text-[14px] font-bold">来源透明度</h2><p className="mt-2 text-[12px] leading-6 text-[#57606a]">每条情报注明事件日期、发布日、核验日期和原始资料。企业投诉独立审核，不自动进入趋势榜。</p><Link href="/sources" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0969da] hover:underline">查看来源目录 <ExternalLink size={12}/></Link></section>
          {latest&&<section className="rounded-md border border-[#d0d7de] bg-white p-4"><h2 className="text-[14px] font-bold">最近收录</h2><p className="mt-2 text-[12px] leading-6 text-[#57606a]">{latest.title}</p><Link href={`/insights/${latest.slug}`} className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0969da] hover:underline">查看完整资料 <ArrowUpRight size={12}/></Link></section>}
        </aside>
      </div>
    </div>
  </>;
}
