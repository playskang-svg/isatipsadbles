import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { LOG_PATH } from "./config.mjs";

const EMPTY = { version: 1, entries: [] };

export function readLog() {
  if (!existsSync(LOG_PATH)) return structuredClone(EMPTY);
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf8"));
  } catch {
    return structuredClone(EMPTY);
  }
}

export function writeLog(log) {
  writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`);
}

/** 같은 질문에 두 번 답하지 않는다. 지식인 URL의 질문 id로 판단한다. */
export function questionId(url) {
  try {
    const parsed = new URL(url);
    const docId = parsed.searchParams.get("docId") ?? parsed.searchParams.get("d1id");
    if (docId) return `kin:${docId}`;
    return `kin:${parsed.pathname.replace(/\/+$/u, "").split("/").pop()}`;
  } catch {
    return `raw:${url}`;
  }
}

export function alreadyAnswered(log, url) {
  const id = questionId(url);
  return log.entries.find((entry) => entry.questionId === id) ?? null;
}

export function answeredToday(log, today = new Date().toISOString().slice(0, 10)) {
  return log.entries.filter((entry) => entry.status === "posted" && entry.postedAt?.startsWith(today)).length;
}

export function appendEntry(log, entry) {
  log.entries.push({ recordedAt: new Date().toISOString(), ...entry });
  return log;
}
