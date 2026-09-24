import type {Metadata} from "next";
import {SubmissionForm} from "@/components/submission-form";
import {canAccept} from "@/lib/config";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"提交合作经验或事实更正"};
export default function SubmitPage(){return <div className="container-page max-w-[1010px] py-12 sm:py-16"><div className="eyebrow">CONTRIBUTE / 投稿与事实更正</div><h1 className="mt-3 text-3xl font-black text-navy sm:text-4xl">让一条经验，帮更多企业核实风险</h1><p className="mt-4 max-w-3xl text-sm leading-8 text-[#697b83]">请只描述自己确实了解、可以核对的商业事实。提交后进入非公开审核队列，不会直接出现在网站上。</p><SubmissionForm enabled={canAccept()} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY??""}/></div>}
