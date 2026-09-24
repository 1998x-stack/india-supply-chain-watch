import {z} from "zod";
import {reportCategories} from "@/lib/config";
export const submissionSchema=z.object({
  kind:z.enum(["EXPERIENCE","CORRECTION"]),
  category:z.enum(reportCategories),
  title:z.string().trim().min(8).max(140),
  body:z.string().trim().min(100).max(6000),
  sourceUrl:z.union([z.literal(""),z.string().trim().url().max(1500).refine(v=>/^https?:\/\//.test(v))]),
  contactEmail:z.string().trim().email().max(254),
  consent:z.literal(true),
  turnstileToken:z.string().min(5).max(4096),
  homepage:z.string().max(200).optional()
});
export const moderationSchema=z.object({
  status:z.enum(["REVIEWING","PUBLISHED","REJECTED","WITHDRAWN"]),
  publicTitle:z.string().trim().max(140).optional(),
  publicBody:z.string().trim().max(6000).optional(),
  editorNote:z.string().trim().max(1500).optional()
});
