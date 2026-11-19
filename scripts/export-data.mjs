// JSON is the single source of truth. Never hand-edit exports/*.csv.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const write = args.includes("--write");
if (check === write) throw new Error("Choose exactly one of --check or --write");

const load = (file) => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const sourceFiles = [
  {
    name: "articles",
    headers: ["date","publishedAt","checkedAt","title","category","kind","sourceType","sourceLabel","sourceUrl","tags","excerpt","takeaway","verification","slug"],
    entries: load("data/articles.json"),
  },
  {
    name: "projects",
    headers: ["approvedOn","verifiedAt","name","product","sector","state","stage","note","sourceLabel","sourceUrl"],
    entries: load("data/projects.json"),
  },
];

// Quote embedded commas, quotes and line breaks; block spreadsheet formula injection.
export function cell(input) {
  let value = Array.isArray(input) ? input.join(" / ") : String(input ?? "");
  if (/^\s*[=+@-]/u.test(value)) value = "'" + value;
  return /[,\r\n"]/.test(value) ? '"' + value.replaceAll('"','""') + '"' : value;
}

export function csv(headers, entries) {
  const rows = [headers.join(","), ...entries.map(entry => headers.map(header => cell(entry[header])).join(","))];
  return "\uFEFF" + rows.join("\r\n") + "\r\n";
}

let drift = false;
for (const source of sourceFiles) {
  const dest = resolve(root, "exports", source.name + ".csv");
  const expected = csv(source.headers, source.entries);
  if (write) {
    writeFileSync(dest, expected, "utf8");
    console.log("WROTE", source.name, source.entries.length);
  } else {
    let actual = "";
    try { actual = readFileSync(dest, "utf8"); } catch { /* missing export */ }
    if (actual !== expected) {
      console.error("STALE CSV", source.name, "— run npm run exports:write");
      drift = true;
    } else console.log("PASS CSV", source.name, source.entries.length);
  }
}
if (drift) process.exitCode = 1;
