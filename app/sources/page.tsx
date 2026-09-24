import type {Metadata} from "next";
import {ExternalLink,FileSearch,ShieldCheck} from "lucide-react";
export const metadata:Metadata={title:"原始资料与核查方法",description:"政策、印度电子产业项目、贸易救济与商业秘密保护原始来源索引。"};
const sources=[
 {name:"印度政府新闻局 PIB",category:"政策与项目公告",url:"https://www.pib.gov.in/",guide:"核对发文部门、发布日期、项目批次；把批准投资与实际投产拆开。"},
 {name:"印度电子和信息技术部 MeitY",category:"电子制造与半导体",url:"https://www.meity.gov.in/",guide:"查 ECMS、半导体计划和资格文件；确认适用产品及政策修订。"},
 {name:"ECMS 官方门户",category:"电子元器件产业政策",url:"https://ecms.meity.gov.in/",guide:"按通知与实施细则核对补贴条件，谨慎区分资格、审批及兑现。"},
 {name:"印度贸易救济总局 DGTR",category:"反倾销及其他贸易措施",url:"https://www.dgtr.gov.in/",guide:"核对产品范围、立案日期、最终裁定、后续税则与生效期限。"},
 {name:"印度工业与国内贸易促进部 DPIIT",category:"外国投资与产业政策",url:"https://dpiit.gov.in/",guide:"核对投资准入、受益所有权、审批路径以及正式政策文件。"},
 {name:"中国政府网",category:"对外投资与国家政策",url:"https://www.gov.cn/",guide:"比对正式文件名称、发布日期、生效日期与具体适用条款。"},
 {name:"中国国家市场监督管理总局",category:"商业秘密和市场监管",url:"https://www.samr.gov.cn/",guide:"了解商业秘密保护、违法行为认定与合理保密措施。"},
 {name:"美光官方投资者关系页面",category:"上市公司与企业披露",url:"https://investors.micron.com/",guide:"核对经营主体、设施性质、公告时间及预计与实际产能；企业公告属于自述。"}
];
export default function Sources(){return <div className="container-page py-12 sm:py-16"><div className="eyebrow">RESEARCH METHODS / 来源体系</div><h1 className="mt-3 text-3xl font-black text-navy sm:text-4xl">原始来源与核查方法</h1><p className="mt-4 max-w-4xl text-sm leading-8 text-[#647884]">公开情报仅对原始文件做简短、可溯源的中文事实整理。公告、媒体报道、企业声明和用户投稿须分别标注；发现版本变化时保留更新时间并修改相应条目。</p><div className="mt-8 grid gap-4 md:grid-cols-2">{sources.map(s=><section className="panel p-6" key={s.name}><div className="flex items-center gap-2 text-brand"><FileSearch size={18}/><span className="tag">{s.category}</span></div><h2 className="mt-4 text-lg font-extrabold text-navy">{s.name}</h2><p className="mt-3 text-sm leading-7 text-[#657984]">{s.guide}</p><a href={s.url} rel="noopener noreferrer" target="_blank" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">访问原始站点 <ExternalLink size={14}/></a></section>)}</div><section className="panel mt-9 bg-[#f1f8f5] p-7"><h2 className="flex items-center gap-2 text-lg font-extrabold text-navy"><ShieldCheck size={21} className="text-brand"/>编辑判断边界</h2><p className="mt-3 text-sm leading-8 text-[#60747d]">官方发布“某项目获批”不等于项目投产；企业陈述不等于司法确认；发现贸易调查不等于最终税令；匿名投诉不等于政府组织行为的证据。我们通过事件日期、来源发布日期、核验日期和状态说明分开展示信息。</p></section></div>}
