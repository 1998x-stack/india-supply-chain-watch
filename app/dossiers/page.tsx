import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight,BookOpen} from 'lucide-react';
import {dossiers} from '@/data/dossiers';
export const metadata:Metadata={title:'专题研究',description:'面向制造企业的 PCB、技术合作和服务器产业跨境研究专题。'};
export default function Dossiers(){return <div className="container-page py-12 sm:py-16"><div className="eyebrow">DOSSIERS / 深度专题</div><h1 className="mt-3 text-3xl font-black text-navy sm:text-4xl">专题研究</h1><p className="mt-4 max-w-3xl text-sm leading-8 text-[#617782]">把分散的政策、制造项目、技术边界和贸易案件整理为能实际用于商业尽调的主题资料；每篇保留原始文件入口。</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{dossiers.map(d=><Link href={`/dossiers/${d.slug}`} key={d.slug} className="panel group p-7 hover:border-[#a8d1c8]"><BookOpen className="text-brand" size={25}/><h2 className="mt-5 text-xl font-extrabold leading-8 text-navy">{d.title}</h2><p className="mt-3 text-sm leading-7 text-[#637781]">{d.subtitle}</p><div className="mt-5 flex flex-wrap gap-2">{d.topics.map(t=><span className="tag" key={t}>{t}</span>)}</div><p className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand">阅读全文<ArrowRight size={15}/></p></Link>)}</div></div>}
