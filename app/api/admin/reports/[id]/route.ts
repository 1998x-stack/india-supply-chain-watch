import {NextRequest,NextResponse} from "next/server";
import {requestIsAdmin,sameOrigin} from "@/lib/security";
import {moderationSchema} from "@/lib/validators";
import {db} from "@/lib/db";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!requestIsAdmin(request))return NextResponse.json({message:"未授权"},{status:401});
 if(!sameOrigin(request))return NextResponse.json({message:"无效来源"},{status:403});
 const body=await request.text();if(body.length>17000)return NextResponse.json({message:"正文过长"},{status:413});
 let value:unknown;try{value=JSON.parse(body);}catch{return NextResponse.json({message:"格式错误"},{status:400});}
 const result=moderationSchema.safeParse(value);if(!result.success)return NextResponse.json({message:"字段格式错误"},{status:400});
 const {id}=await params;if(!/^c[a-z0-9]{15,35}$/.test(id))return NextResponse.json({message:"ID 格式错误"},{status:400});
 try{const existing=await db().report.findUnique({where:{id}});if(!existing)return NextResponse.json({message:"投稿不存在"},{status:404});
 const {status,publicTitle,publicBody,editorNote}=result.data;
 const finalTitle=publicTitle??existing.publicTitle??"";
 const finalBody=publicBody??existing.publicBody??"";
 if(status==="PUBLISHED"&&(finalTitle.length<8||finalBody.length<100))return NextResponse.json({message:"公开前必须填写至少 8 字标题和 100 字经过编辑的公开正文。"},{status:400});
 await db().report.update({where:{id},data:{status,publicTitle:publicTitle??existing.publicTitle,publicBody:publicBody??existing.publicBody,editorNote:editorNote??existing.editorNote,publishedAt:status==="PUBLISHED"?(existing.publishedAt??new Date()):null}});
 return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("Moderation error",error);return NextResponse.json({message:"保存失败，请稍后重试"},{status:503});}
}
