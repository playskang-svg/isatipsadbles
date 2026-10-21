import { PROJECT_ROOT as root } from "../site/paths.mjs";
import { readFileSync, existsSync } from "node:fs";


export { articleUrl } from "../site/site.mjs";
export const CONFIG_PATH = `${root}/data/jisikin-config.json`;
export const LOG_PATH = `${root}/data/jisikin-log.json`;

const fallback = {
  dailyAnswerLimit: 3,
  matchThreshold: 0.42,
  strongMatchThreshold: 0.62,
  minAnswerChars: 300,
  maxLinksPerAnswer: 1,
  targetKeywords: [],
};

export function loadConfig() {
  if (!existsSync(CONFIG_PATH)) return { ...fallback };
  return { ...fallback, ...JSON.parse(readFileSync(CONFIG_PATH, "utf8")) };
}
