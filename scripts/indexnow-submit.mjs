#!/usr/bin/env node
/**
 * IndexNow 제출 스크립트
 *
 * 사이트맵을 읽어 최근 변경된 URL만 IndexNow에 제출한다.
 * 참여 검색엔진: Bing, Naver, Yandex, Seznam, Yep, Amazon (구글은 미참여)
 *
 * 사용법
 *   node scripts/indexnow-submit.mjs                     # 최근 7일 내 lastmod URL 제출
 *   node scripts/indexnow-submit.mjs --days 1            # 최근 1일
 *   node scripts/indexnow-submit.mjs --url /articles/foo # 특정 URL만 제출
 *   node scripts/indexnow-submit.mjs --all               # 사이트맵 전체 (신중히 사용)
 *   node scripts/indexnow-submit.mjs --dry-run           # 제출 없이 대상만 출력
 *
 * 키 파일은 public/<key>.txt 이며 배포 후 https://<host>/<key>.txt 로 공개되어야 한다.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://isatips.adbles.com").replace(/\/$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10000;

function parseArgs(argv) {
  const opts = { days: 7, urls: [], all: false, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--days") opts.days = Number(argv[++i]);
    else if (arg === "--url") opts.urls.push(argv[++i]);
    else if (arg === "--all") opts.all = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else throw new Error(`알 수 없는 인자: ${arg}`);
  }
  if (!Number.isFinite(opts.days) || opts.days < 0) throw new Error("--days 값이 올바르지 않습니다.");
  return opts;
}

function findKey() {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv) return fromEnv;
  const candidates = readdirSync(PUBLIC_DIR).filter((name) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(name));
  if (candidates.length === 0) throw new Error("public/ 에 IndexNow 키 파일(<key>.txt)이 없습니다.");
  if (candidates.length > 1) throw new Error(`IndexNow 키 파일이 여러 개입니다: ${candidates.join(", ")}`);
  const name = candidates[0];
  const key = name.replace(/\.txt$/, "");
  const body = readFileSync(join(PUBLIC_DIR, name), "utf8").trim();
  if (body !== key) throw new Error(`키 파일 내용이 파일명과 다릅니다: ${name}`);
  return key;
}

function absolute(url) {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function fetchSitemapEntries() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "user-agent": "isatips-indexnow/1.0" } });
  if (!res.ok) throw new Error(`사이트맵을 읽지 못했습니다: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  const entries = [];
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim();
    entries.push({ loc, lastmod: lastmod ? new Date(lastmod) : null });
  }
  if (entries.length === 0) throw new Error("사이트맵에서 URL을 찾지 못했습니다.");
  return entries;
}

async function submit(host, key, urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList }),
  });
  const text = await res.text().catch(() => "");
  return { status: res.status, ok: res.ok, text: text.slice(0, 400) };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const key = findKey();
  const host = new URL(SITE_URL).host;

  let targets;
  if (opts.urls.length > 0) {
    targets = opts.urls.map(absolute);
  } else {
    const entries = await fetchSitemapEntries();
    if (opts.all) {
      targets = entries.map((entry) => entry.loc);
    } else {
      const cutoff = Date.now() - opts.days * 24 * 60 * 60 * 1000;
      targets = entries
        .filter((entry) => entry.lastmod && entry.lastmod.getTime() >= cutoff)
        .map((entry) => entry.loc);
    }
  }

  targets = [...new Set(targets)].filter((url) => url.startsWith(SITE_URL));
  if (targets.length === 0) {
    console.log(`제출할 URL이 없습니다 (기준: 최근 ${opts.days}일).`);
    return;
  }

  console.log(`대상 ${targets.length}건 / host=${host} / key=${key}`);
  for (const url of targets) console.log(`  - ${url}`);
  if (opts.dryRun) {
    console.log("--dry-run 이므로 제출하지 않았습니다.");
    return;
  }

  // 키 파일이 실제로 공개돼 있는지 먼저 확인한다. 없으면 IndexNow가 전부 거절한다.
  const keyCheck = await fetch(`${SITE_URL}/${key}.txt`);
  if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) {
    throw new Error(`키 파일이 공개되지 않았습니다: ${SITE_URL}/${key}.txt (배포 완료 후 다시 실행하세요)`);
  }

  for (let i = 0; i < targets.length; i += MAX_URLS_PER_REQUEST) {
    const chunk = targets.slice(i, i + MAX_URLS_PER_REQUEST);
    const result = await submit(host, key, chunk);
    console.log(`제출 ${chunk.length}건 → HTTP ${result.status}${result.text ? ` ${result.text}` : ""}`);
    if (!result.ok) process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`IndexNow 제출 실패: ${error.message}`);
  process.exit(1);
});
