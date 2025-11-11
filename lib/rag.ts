// rag.ts
import fs from "fs";
import path from "path";

export async function loadDocument() {
  const text = fs.readFileSync(path.resolve(process.cwd(), "public/stadgar.txt"), "utf8");
  return text;
}
