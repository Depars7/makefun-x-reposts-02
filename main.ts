// makefun-x-reposts-02 entry program (Node 22, standard library only).
// The entry is the seven X posts themselves: each one quotes a different
// @makefunai pool post from @belphegor_sol and carries the play code.
// This program only hands the house the list of those posts: it reads
// POSTS.json from the repository root, checks it is a list of 1-15 post
// addresses, and writes an identical copy to the output directory, where
// the gate reads it. No network, no secrets, no randomness — the same
// input always produces the same output.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(BOT_DIR, "POSTS.json");
const targetPath = join(OUTPUT_DIR, "POSTS.json");

let raw: string;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch (err) {
  console.error(
    `POSTS.json could not be read from ${sourcePath}: ${(err as Error).message}`,
  );
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error(`POSTS.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (
  typeof parsed !== "object" ||
  parsed === null ||
  !Array.isArray((parsed as { posts?: unknown }).posts)
) {
  console.error('POSTS.json must be an object with a "posts" array.');
  process.exit(1);
}

const list = (parsed as { posts: unknown[] }).posts;
if (list.length < 1 || list.length > 15) {
  console.error(`POSTS.json must list 1-15 posts, found ${list.length}.`);
  process.exit(1);
}

for (const entry of list) {
  if (
    typeof entry !== "string" ||
    !entry.startsWith("https://x.com/belphegor_sol/status/")
  ) {
    console.error(`POSTS.json holds a bad post address: ${String(entry)}`);
    process.exit(1);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(targetPath, raw, "utf8");
console.log(`Wrote ${list.length} posts to ${targetPath}.`);
