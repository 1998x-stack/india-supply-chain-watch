import {NextRequest,NextResponse} from "next/server";
import {canAccept} from "@/lib/config";
import {db} from "@/lib/db";
import {ipDigest,sameOrigin} from "@/lib/security";
import {submissionSchema} from "@/lib/validators";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const respond=(message:string,status:number)=>NextResponse.json({message},{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:NextRequest){
 if(!canAccept())return respond("投稿服务尚未开启。",503);
 if(!sameOrigin(request))return respond("请求来源无效。",403);
 const body=await request.text();if(body.length>18000)return respond("正文过长。",413);
 let payload:unknown;try{payload=JSON.parse(body);}catch{return respond("请求格式错误。",400);}
 const parsed=submissionSchema.safeParse(payload);if(!parsed.success)return respond("填写内容不完整或格式不符合要求。",400);
 const values=parsed.data;
 if(values.homepage)return NextResponse.json({message:"已收到。"},{status:202});
 const checkForm=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:values.turnstileToken});
 try{const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:checkForm,signal:AbortSignal.timeout(6500),cache:"no-store"});const data=await verification.json() as {success?:boolean,hostname?:string};
 if(!data.success||!data.hostname||data.hostname!==request.nextUrl.hostname)return respond("人机验证失败，请重新验证。",403);
 }catch{return respond("人机验证服务暂不可用，请稍后重试。",503);}
 const remoteIp=(request.headers.get("x-real-ip")||request.headers.get("x-forwarded-for")?.split(",")[0]||"").trim();
 if(!remoteIp)return respond("无法核验访问来源。",403);
 const hash=ipDigest(remoteIp);
 try{
 const count=await db().report.count({where:{ipDigest:hash,createdAt:{gte:new Date(Date.now()-60*60*1000)}}});
 if(count>=3)return respond("该网络提交较频繁，请稍后再试。",429);
 await db().report.create({data:{kind:values.kind,category:values.category,title:values.title,body:values.body,sourceUrl:values.sourceUrl||null,contactEmail:values.contactEmail,ipDigest:hash,consent:true,status:"PENDING"}});
 return NextResponse.json({message:"投稿已私密接收，等待审核。"},{status:202,headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("Submission store error",error);return respond("投稿服务暂不可用，请稍后再试。",503);}
}
