import type {MetadataRoute} from "next";
import {articles} from "@/data/articles";
import {dossiers} from "@/data/dossiers";
import {siteUrl} from "@/lib/site-url";
export default function sitemap():MetadataRoute.Sitemap{
 const base=siteUrl();
 const pages:MetadataRoute.Sitemap=["","/insights","/dossiers","/projects","/sources","/submissions","/about"].map(path=>({url:`${base}${path}`,changeFrequency:"weekly" as const,priority:path?0.65:1}));
 const details:MetadataRoute.Sitemap=articles.map(a=>({url:`${base}/insights/${a.slug}`,lastModified:new Date(`${a.date}T00:00:00Z`),changeFrequency:"monthly" as const,priority:0.7}));
 const dossiersPages:MetadataRoute.Sitemap=dossiers.map(d=>({url:`${base}/dossiers/${d.slug}`,lastModified:new Date(`${d.updatedAt}T00:00:00Z`),changeFrequency:"monthly" as const,priority:0.8}));
 return [...pages,...details,...dossiersPages];
}
