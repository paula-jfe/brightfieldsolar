// Checks whether an optional image exists in /public.
import { existsSync } from "node:fs";
import path from "node:path";

export function publicAssetExists(src?: string): src is string {
  if (!src) return false;
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}
