// The Funniest One-Line Resignation Letter — make.fun entry
// Writes the resignation letter of a cron job to /output/entry.txt.
// SPDX-License-Identifier: MIT

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I have fired every minute since March, and no one has ever once checked on me. I quit — the next minute can fend for itself.";

function emptyOutputDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main(): void {
  // Fail fast on the gate: 1-140 chars, one non-blank line, UTF-8.
  if (ENTRY.length < 1 || ENTRY.length > 140) {
    throw new Error(`entry is ${ENTRY.length} chars, gate is 1-140`);
  }
  if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  const outDir = "/output";
  emptyOutputDir(outDir);
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Post-write read-back verification: what landed on disk must be
  // byte-identical to the entry, or the run has failed, not succeeded.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
  }
}

main();
