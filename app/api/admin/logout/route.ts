import {NextRequest,NextResponse} from "next/server";
import {cookieName,sameOrigin} from "@/lib/security";
export async function POST(request:NextRequest){if(!sameOrigin(request))return NextResponse.json({message:"无效来源"},{status:403});const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});response.cookies.set(cookieName,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:0});return response;}
