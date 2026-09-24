import records from "./projects.json";
import type { TrackedProject } from "@/lib/types";
export const projects = (records as TrackedProject[]).slice().sort((a,b)=>b.approvedOn.localeCompare(a.approvedOn)||a.name.localeCompare(b.name));
