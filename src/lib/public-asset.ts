import { existsSync } from "node:fs";
import path from "node:path";

/**
 * True when a file exists under /public. Used by Server Components to fall
 * back to a neutral placeholder instead of rendering a broken <img> when an
 * optional image (crew photo, hero art) hasn't been added to the repo yet.
 * Runs at build/render time on the server only.
 */
export function publicAssetExists(src?: string): src is string {
  if (!src) return false;
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}
