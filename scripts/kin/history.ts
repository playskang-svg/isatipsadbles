import fs from "node:fs";
import path from "node:path";

export interface HistoryEntry {
  url: string;
  articleSlug: string;
  question: string;
  answer: string;
  createdAt: string; // YYYY-MM-DDTHH:mm:ss
}

const HISTORY_PATH = path.resolve(process.cwd(), "data/jisikin-history.json");

export function loadHistory(): HistoryEntry[] {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf-8"));
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry): void {
  const list = loadHistory();
  list.push(entry);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(list, null, 2), "utf-8");
}

export function getTodayAnswerCount(): number {
  const todayPrefix = new Date().toISOString().slice(0, 10);
  return loadHistory().filter(h => h.createdAt.startsWith(todayPrefix)).length;
}

export function isDuplicateQuestion(url: string, question: string): boolean {
  const list = loadHistory();
  return list.some(h => (url && h.url === url) || (question && h.question.trim() === question.trim()));
}
