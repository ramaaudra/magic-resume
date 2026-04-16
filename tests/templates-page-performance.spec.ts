import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const templatesPagePath = path.resolve(
  projectRoot,
  "src/app/app/dashboard/templates/page.tsx"
);

test("template gallery page keeps heavy preview rendering out of the top-level module", () => {
  const contents = readFileSync(templatesPagePath, "utf8");

  assert.ok(!contents.includes("ResumeTemplateComponent"));
  assert.ok(!contents.includes("createTemplatePreviewData"));
  assert.ok(!contents.includes("normalizeFontFamily"));
});
