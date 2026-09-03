import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  ".env.example",
  ".openai/hosting.json",
  "package.json",
  "package-lock.json",
  "app/layout.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/api/coupang-products/route.ts",
  "lib/articles.ts",
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length) {
  throw new Error(`필수 이전 파일 누락: ${missingFiles.join(", ")}`);
}

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const forbiddenTrackedFiles = trackedFiles.filter((file) =>
  /(^|\/)(\.env($|\.)|.*\.(pem|key|p12|pfx|bundle|tar|tar\.gz|zip)$)/i.test(file) &&
  file !== ".env.example",
);

if (forbiddenTrackedFiles.length) {
  throw new Error(`GitHub에 올리면 안 되는 파일이 추적 중입니다: ${forbiddenTrackedFiles.join(", ")}`);
}

const envExample = readFileSync(".env.example", "utf8");
const requiredEnvKeys = ["NEXT_PUBLIC_SITE_URL", "COUPANG_ACCESS_KEY", "COUPANG_SECRET_KEY"];
const missingEnvKeys = requiredEnvKeys.filter((key) => !envExample.includes(`${key}=`));

if (missingEnvKeys.length) {
  throw new Error(`.env.example 환경변수 누락: ${missingEnvKeys.join(", ")}`);
}

const hosting = JSON.parse(readFileSync(".openai/hosting.json", "utf8"));
if (!hosting.project_id) {
  throw new Error("현재 Sites 프로젝트 식별자가 없습니다.");
}

const imageCount = trackedFiles.filter((file) => file.startsWith("public/images/")).length;
const contentFileCount = trackedFiles.filter((file) => file.startsWith("lib/") && file.endsWith(".ts")).length;

console.log("Migration preflight passed");
console.log(`Tracked files: ${trackedFiles.length}`);
console.log(`Tracked images: ${imageCount}`);
console.log(`Content/config modules: ${contentFileCount}`);
console.log(`Required environment keys documented: ${requiredEnvKeys.length}`);
