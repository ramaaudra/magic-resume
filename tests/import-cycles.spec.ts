import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.resolve(projectRoot, "src");
const allowedExtensions = [".ts", ".tsx"];
const excludedFiles = new Set([
  path.resolve(srcRoot, "routeTree.gen.ts"),
  path.resolve(srcRoot, "generated/templateSnapshotManifest.ts"),
]);

const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

function collectFiles(dir: string): string[] {
  const stats = statSync(dir);

  if (stats.isFile()) {
    if (
      !allowedExtensions.includes(path.extname(dir)) ||
      excludedFiles.has(dir)
    ) {
      return [];
    }

    return [dir];
  }

  return readdirSync(dir).flatMap((entry) => collectFiles(path.join(dir, entry)));
}

function resolveImport(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) {
    return null;
  }

  const unresolved = specifier.startsWith("@/")
    ? path.join(srcRoot, specifier.slice(2))
    : path.resolve(path.dirname(fromFile), specifier);

  const candidates = [
    unresolved,
    ...allowedExtensions.map((extension) => `${unresolved}${extension}`),
    ...allowedExtensions.map((extension) =>
      path.join(unresolved, `index${extension}`)
    ),
  ];

  for (const candidate of candidates) {
    if (!path.extname(candidate) || excludedFiles.has(candidate)) {
      continue;
    }

    try {
      if (statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function buildGraph(files: string[]) {
  return new Map(
    files.map((file) => {
      const contents = readFileSync(file, "utf8");
      const dependencies = new Set<string>();

      for (const match of contents.matchAll(importPattern)) {
        const resolved = resolveImport(file, match[1]);
        if (resolved) {
          dependencies.add(resolved);
        }
      }

      return [file, [...dependencies]];
    })
  );
}

function findCycles(graph: Map<string, string[]>) {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const stackPath: string[] = [];
  const cycles = new Set<string>();

  function visit(node: string) {
    if (stack.has(node)) {
      const cycleStart = stackPath.indexOf(node);
      const cycle = [...stackPath.slice(cycleStart), node]
        .map((file) => path.relative(projectRoot, file))
        .join(" -> ");
      cycles.add(cycle);
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    stack.add(node);
    stackPath.push(node);

    for (const dependency of graph.get(node) ?? []) {
      visit(dependency);
    }

    stack.delete(node);
    stackPath.pop();
  }

  for (const node of graph.keys()) {
    visit(node);
  }

  return [...cycles].sort();
}

test("source modules do not contain local import cycles", () => {
  const files = collectFiles(srcRoot);
  const cycles = findCycles(buildGraph(files));

  assert.deepEqual(cycles, []);
});
