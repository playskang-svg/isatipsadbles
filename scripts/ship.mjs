#!/usr/bin/env node
/**
 * ship — 검증부터 배포 확인까지 한 번에 돌리는 발행 파이프라인.
 *
 *   npm run ship -- -m "커밋 메시지"
 *   npm run ship -- -m "..." --skip-build     빌드·SEO 감사 생략(문서만 고쳤을 때)
 *   npm run ship -- --dry-run                 검증만 하고 커밋·푸시 안 함
 *   npm run ship -- -m "..." --no-wait        배포 확인 없이 푸시까지만
 *
 * 순서
 *   0 사전점검(브랜치·원격·비밀파일)
 *   1 tsc --noEmit
 *   2 migration preflight
 *   3 클린 빌드
 *   4 로컬 서버 + SEO 감사
 *   5 커밋
 *   6 푸시
 *   7 배포 반영 확인(라이브 폴링)
 *
 * 푸시는 git 자격증명이 있는 환경에서만 된다. Cowork 클라우드 세션에는 없으므로
 * 6단계에서 멈추고 실행할 명령을 알려준 뒤 종료한다.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://isatips.adbles.com").replace(/\/$/, "");
const BRANCH = "main";
const REQUIRED_IGNORES = [".env", "dist/", ".wrangler/", ".claude/"];

const args = process.argv.slice(2);
const opts = { message: "", dryRun: false, skipBuild: false, wait: true };
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === "-m" || a === "--message") opts.message = args[++i] ?? "";
  else if (a === "--dry-run") opts.dryRun = true;
  else if (a === "--skip-build") opts.skipBuild = true;
  else if (a === "--no-wait") opts.wait = false;
  else fail(`알 수 없는 인자: ${a}`);
}

let step = 0;
function head(title) {
  step += 1;
  console.log(`\n[1m[${step}] ${title}[0m`);
}
function fail(msg) {
  console.error(`\n[31m중단: ${msg}[0m`);
  process.exit(1);
}
function run(cmd, cmdArgs, { capture = false, allowFail = false } = {}) {
  const res = spawnSync(cmd, cmdArgs, {
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
  });
  if (!allowFail && res.status !== 0) {
    if (capture) console.error((res.stdout || "") + (res.stderr || ""));
    fail(`${cmd} ${cmdArgs.join(" ")} 실패`);
  }
  return res;
}

function checkNativeBindings() {
  const root = "node_modules/@rolldown";
  if (!existsSync(root)) return; // 아직 설치 전이면 npm이 알아서 알려준다
  const { platform, arch } = process;
  const prefix = `binding-${platform}-${arch}`;
  const candidates = readdirSync(root).filter((name) => name.startsWith(prefix));
  const usable = candidates.some((name) => {
    try {
      return readdirSync(`${root}/${name}`).some((f) => f.endsWith(".node") || f.endsWith(".wasm"));
    } catch {
      return false;
    }
  });
  if (usable) return;

  const installed = readdirSync(root)
    .filter((name) => name.startsWith("binding-"))
    .filter((name) => {
      try {
        return readdirSync(`${root}/${name}`).some((f) => f.endsWith(".node") || f.endsWith(".wasm"));
      } catch {
        return false;
      }
    })
    .map((name) => name.replace("binding-", ""));

  fail(`node_modules가 다른 플랫폼용입니다.
  이 환경: ${platform}-${arch}
  설치된 바인딩: ${installed.join(", ") || "없음"}

맥과 Cowork 리눅스 샌드박스가 같은 node_modules 폴더를 공유하기 때문입니다.
네이티브 바인딩은 한쪽 것만 설치되므로 양쪽에서 빌드할 수 없습니다.

이 환경에서 빌드하려면:

    rm -rf node_modules && npm ci

다만 그러면 반대쪽에서 다시 깨집니다. node_modules는 배포를 실행하는
맥 쪽 소유로 두고, Cowork 세션에서는 npm ci / npm run build를 돌리지
않는 편이 낫습니다. 빌드 검증은 GitHub Actions가 대신합니다.`);
}

const git = (...a) => run("git", a, { capture: true }).stdout.trim();

// ── 0. 사전점검 ──────────────────────────────────────────────
head("사전점검");
if (!existsSync(".git")) fail("git 저장소가 아닙니다.");
const branch = git("branch", "--show-current");
if (branch !== BRANCH) fail(`현재 브랜치가 ${branch}입니다. ${BRANCH}에서 실행하세요.`);
if (!git("remote").split("\n").includes("origin")) fail("origin 원격이 없습니다.");

const ignores = existsSync(".gitignore") ? readFileSync(".gitignore", "utf8") : "";
const missing = REQUIRED_IGNORES.filter((entry) => !ignores.includes(entry));
if (missing.length) fail(`.gitignore에 다음이 없습니다: ${missing.join(", ")}`);

// node_modules는 맥과 리눅스 샌드박스가 같은 폴더를 공유한다. 네이티브 바인딩은
// 한쪽 플랫폼 것만 설치되므로, 다른 쪽에서 빌드하면 이해하기 어려운 에러가 난다.
checkNativeBindings();

const status = run("git", ["status", "--porcelain"], { capture: true }).stdout.replace(/\n$/, "");
const changed = status ? status.split("\n").map((line) => line.replace(/^.{2}\s/, "")) : [];
const secretish = changed.filter((p) => /(^|\/)\.env($|\.)|\.(pem|key|p12|pfx)$/.test(p));
if (secretish.length) fail(`비밀 파일이 변경 목록에 있습니다: ${secretish.join(", ")}`);

if (changed.length) {
  console.log("변경된 파일:");
  for (const p of changed) console.log(`  ${p}`);
  console.log("\n다른 세션이 만든 변경이 섞여 있지 않은지 확인하세요.");
} else {
  console.log("작업 트리 깨끗함 (커밋되지 않은 변경 없음)");
}
const ahead = Number(git("rev-list", "--count", `origin/${BRANCH}..${BRANCH}`) || "0");
console.log(`원격보다 앞선 커밋: ${ahead}개`);

if (!opts.dryRun && changed.length && !opts.message) {
  fail('커밋할 변경이 있습니다. -m "메시지" 로 커밋 메시지를 주세요.');
}

// ── 1~4. 검증 ────────────────────────────────────────────────
head("타입 검사 (tsc --noEmit)");
run("npm", ["run", "lint"]);

head("migration preflight");
run("npm", ["run", "audit:migration"]);

if (opts.skipBuild) {
  head("빌드·SEO 감사 생략 (--skip-build)");
} else {
  head("클린 빌드");
  run("rm", ["-rf", "dist"], { allowFail: true });
  run("npm", ["run", "build"]);

  head("로컬 서버 + SEO 감사");
  const server = spawnSync("bash", ["-c", `
    npm run start > /tmp/ship-server.log 2>&1 &
    SERVER_PID=$!
    for i in $(seq 1 30); do
      sleep 2
      curl -sf -o /dev/null http://127.0.0.1:3000/ && break
    done
    npm run audit:seo
    STATUS=$?
    kill $SERVER_PID 2>/dev/null
    exit $STATUS
  `], { stdio: "inherit" });
  if (server.status !== 0) fail("SEO 감사 실패 (로그: /tmp/ship-server.log)");
}

if (opts.dryRun) {
  console.log("\n--dry-run 이므로 커밋·푸시하지 않았습니다.");
  process.exit(0);
}

// ── 5. 커밋 ──────────────────────────────────────────────────
head("커밋");
if (changed.length) {
  run("git", ["add", "-A"]);
  const commit = spawnSync("git", ["commit", "-F", "-"], { input: opts.message, encoding: "utf8", stdio: ["pipe", "inherit", "inherit"] });
  if (commit.status !== 0) fail("커밋 실패 (git user.name/user.email 설정 확인)");
} else {
  console.log("커밋할 변경 없음 — 건너뜀");
}

// ── 6. 푸시 ──────────────────────────────────────────────────
head("푸시");
const push = spawnSync("git", ["push", "origin", BRANCH], { stdio: "inherit" });
if (push.status !== 0) {
  console.error(`
푸시하지 못했습니다. git 자격증명이 없는 환경일 수 있습니다
(Cowork 클라우드 세션에는 맥 키체인이 없습니다).

커밋은 만들어져 있으니 자격증명이 있는 터미널에서 아래를 실행하세요.

    git push origin ${BRANCH}
`);
  process.exit(1);
}

// ── 7. 배포 확인 ─────────────────────────────────────────────
if (!opts.wait) {
  console.log("\n푸시 완료. --no-wait 이므로 배포 확인은 생략합니다.");
  process.exit(0);
}

head("배포 반영 확인");
const sha = git("rev-parse", "HEAD").slice(0, 7);
console.log(`푸시한 커밋 ${sha} — GitHub Actions가 lint → build → 배포 → IndexNow 제출을 수행합니다.`);

let ok = false;
for (let i = 1; i <= 20; i += 1) {
  await new Promise((r) => setTimeout(r, 15000));
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "cache-control": "no-cache" } });
    if (res.ok) {
      process.stdout.write(`  ${i * 15}초 경과 — 사이트 응답 정상\n`);
      ok = true;
      break;
    }
    process.stdout.write(`  ${i * 15}초 경과 — HTTP ${res.status}\n`);
  } catch {
    process.stdout.write(`  ${i * 15}초 경과 — 아직 응답 없음\n`);
  }
}

if (ok) {
  console.log(`\n완료. Actions 로그에서 IndexNow 제출 결과(제출 N건 → HTTP 200)를 확인하세요.`);
} else {
  console.log(`\n5분 안에 확인되지 않았습니다. GitHub Actions 탭에서 배포 상태를 직접 보세요.`);
}
