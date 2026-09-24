import {NextRequest,NextResponse} from "next/server";
import {requestIsAdmin} from "@/lib/security";
import {db} from "@/lib/db";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
 if(!requestIsAdmin(request))return NextResponse.json({message:"未授权"},{status:401,headers:{"Cache-Control":"no-store"}});
 try{const reports=await db().report.findMany({orderBy:{createdAt:"desc"},take:100});return NextResponse.json({reports},{headers:{"Cache-Control":"private, no-store"}});}
 catch(error){console.error("Admin listing error",error);return NextResponse.json({message:"数据库尚未就绪"},{status:503});}
}
