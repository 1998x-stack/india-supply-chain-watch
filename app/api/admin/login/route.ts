import {NextRequest,NextResponse} from "next/server";
import {cookieName,newSession,sameOrigin,secretReady,validPassword} from "@/lib/security";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return NextResponse.json({message:"无效来源"},{status:403});
 if(!secretReady()||!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<16)return NextResponse.json({message:"管理员账户尚未配置"},{status:503});
 const body=await request.text();if(body.length>600)return NextResponse.json({message:"请求过长"},{status:413});
 let value:unknown;try{value=JSON.parse(body);}catch{return NextResponse.json({message:"格式错误"},{status:400});}
 if(!value||typeof value!=="object"||!("password" in value)||typeof value.password!=="string"||!validPassword(value.password))return NextResponse.json({message:"密码错误"},{status:401,headers:{"Cache-Control":"no-store"}});
 const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 response.cookies.set(cookieName,newSession(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:24*60*60});
 return response;
}
