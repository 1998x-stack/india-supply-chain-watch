import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const articles=JSON.parse(readFileSync(new URL('../data/articles.json',import.meta.url),'utf8'));
const projects=JSON.parse(readFileSync(new URL('../data/projects.json',import.meta.url),'utf8'));
const current='2026-09-24';
assert(articles.length>=25, 'at least 25 real, sourced research entries');
const slugs=new Set();
const categories=new Set(['产业政策','PCB / PCBA','半导体','服务器与电子制造','贸易与合规','企业经验']);
function validDate(date,where) {assert(/^20\d\d-\d\d-\d\d$/.test(date),`invalid date format: ${where}`);assert(new Date(date).toISOString().startsWith(date),`invalid ISO date: ${where}`);assert(date<=current,`future event or publication: ${where}`);}
for (const [i,a] of articles.entries()) {
 assert(/^[a-z0-9-]+$/.test(a.slug),`invalid slug ${i}`);assert(!slugs.has(a.slug),`duplicate slug ${a.slug}`);slugs.add(a.slug);
 for(const key of ['date','publishedAt','checkedAt'])validDate(a[key],`${a.slug} ${key}`);
 assert(categories.has(a.category),`unknown article category ${a.slug}`);
 assert(a.points.length>=2&&a.takeaway.length>15&&a.title.length>10,`incomplete ${a.slug}`);
 assert(a.tags.length>=1&&a.sourceType&&a.verification,`evidence metadata missing ${a.slug}`);
 const u=new URL(a.sourceUrl);assert(u.protocol==='https:'&&!u.hostname.endsWith('example.com'),`source URL ${a.slug}`);
 assert(a.sourceLabel.length>3,`source label ${a.slug}`);
}
assert(projects.length>=12,'too few tracked projects');
const ids=new Set();
for(const p of projects){
 assert(!ids.has(p.id),`duplicate project ID ${p.id}`);ids.add(p.id);
 validDate(p.approvedOn,p.id);validDate(p.verifiedAt,p.id);
 assert(p.name&&p.product&&p.stage==='官方公布获批'&&p.note&&p.sourceLabel,p.id);
 assert(new URL(p.sourceUrl).protocol==='https:',p.id);
}
console.log(`PASS: ${articles.length} dated, individually sourced research records and ${projects.length} source-linked company project records validated.`);
