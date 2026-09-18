import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// scripts/site/ → 프로젝트 루트
export const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
