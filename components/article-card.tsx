import Link from "next/link";
import {ArrowUpRight,CalendarDays,Link2} from "lucide-react";
import type {Article} from "@/lib/types";
export function ArticleCard({article,compact=false}:{article:Article,compact?:boolean}){return <Link href={`/insights/${article.slug}`} className="group panel flex h-full flex-col p-5 hover:-translate-y-0.5 hover:border-[#a8cfc6] hover:shadow-soft sm:p-6">
<div className="mb-4 flex flex-wrap items-center gap-2"><span className="tag">{article.category}</span><span className="text-xs text-[#83929b]">{article.kind}</span></div><h3 className={`font-bold leading-[1.6] text-navy group-hover:text-brand ${compact?"text-base":"text-lg"}`}>{article.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-[#667a83]">{article.excerpt}</p><div className="mt-5 flex items-center justify-between gap-2 border-t border-[#eff3f1] pt-4"><span className="flex items-center gap-1.5 text-xs text-[#81919a]"><CalendarDays size={13}/>{article.date}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-brand"><Link2 size={13}/>查看原始来源<ArrowUpRight size={13}/></span></div>
</Link>}
