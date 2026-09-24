import records from "./articles.json";
import type { Article } from "@/lib/types";
export const articles = (records as Article[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
export function findArticle(slug:string) {return articles.find(a=>a.slug===slug);}
