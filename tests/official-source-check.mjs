import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../"+path,import.meta.url), "utf8");
const articles=JSON.parse(read("data/articles.json"));
const projects=JSON.parse(read("data/projects.json"));
const find=slug=>articles.find(x=>x.slug===slug);

const ecms=find("ecms-november-2026-12-approvals");
assert(ecms,"missing Nov 6 ECMS bulletin");
assert.equal(ecms.publishedAt,"2026-11-06");
assert.equal(ecms.checkedAt,"2026-11-19");
assert(ecms.sourceUrl.includes("PRID=2333716"));
assert(ecms.points.some(p=>p.includes("118")&&p.includes("₹77,051")),"ECMS cumulative count must be sourced");
assert(ecms.takeaway.includes("不等于"),"approval must not be presented as production");
const dgtr=find("pcb-tools-final-findings-2026");
assert(dgtr&&dgtr.sourceUrl.includes("dgtr.gov.in"));
assert.equal(dgtr.publishedAt,"2026-09-25");
assert(dgtr.takeaway.includes("不应声称")&&dgtr.verification.includes("未独立核验"),"Final Findings must not be misreported as effective duty");
const fdi=find("india-fdi-revised-framework-aug-2026");
assert(fdi&&fdi.sourceUrl.includes("PRID=2301992"));
assert(fdi.takeaway.includes("10%"),"beneficial ownership scope must be explained");
for (const name of [
  "NeST ICELR Private Limited",
  "Indo Asia Copper Limited",
  "Voltix Semicon Private Limited",
  "Wipro Pari Robotics Private Limited",
]){
 const p=projects.find(x=>x.name===name);
 assert(p&&p.approvedOn==="2026-11-06"&&p.verifiedAt==="2026-11-19",name);
 assert(p.stage==="官方公布获批"&&p.note.includes("不代表"),"project must not claim operating capacity");
}
const dossiers=read("data/dossiers.ts");
assert(dossiers.includes("2026 年 9 月 25 日发布 Final Findings"),"PCB dossier should reflect findings");
assert(dossiers.includes("累计批准 118 项申请"),"ECMS dossier should reflect November changes");
const board=read("components/trending-board.tsx");
assert(board.includes("staleCount")&&board.includes("核验 {dateText(a.checkedAt)}"),"stale source transparency should remain visible");
console.log("PASS: three official-source updates, four named approvals, risk qualifiers and dossier consistency");
