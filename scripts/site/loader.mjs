// lib/*.ts를 빌드 없이 그대로 읽기 위한 ESM 훅.
// 프로젝트가 vite/vinext 경로 규칙(@/ 별칭, 확장자 없는 상대경로, JSON 기본 import)을
// 쓰기 때문에 순수 node에서는 해석되지 않는다. 그 세 가지만 메워준다.
//
// 훅은 별도 워커에서 돌아 부모의 런타임 env를 보지 못한다. 루트는 initialize로 받는다.
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

let root = "";

export async function initialize(data) {
  root = data.root;
}

export async function resolve(specifier, context, nextResolve) {
  let target = specifier;

  if (target.startsWith("@/")) {
    target = pathToFileURL(`${root}/${target.slice(2)}`).href;
  }

  if (target.startsWith("./") || target.startsWith("../")) {
    const candidate = new URL(target, context.parentURL);
    if (!/\.[a-z]+$/u.test(candidate.pathname) && existsSync(`${candidate.pathname}.ts`)) {
      target = `${candidate.href}.ts`;
    }
  }

  if (target.endsWith(".json")) {
    const url = target.startsWith("file:") ? target : new URL(target, context.parentURL).href;
    return { url, format: "json-as-module", shortCircuit: true };
  }

  return nextResolve(target, context);
}

export async function load(url, context, nextLoad) {
  // node는 JSON import에 attribute를 요구하지만 vite는 요구하지 않는다. 소스를 합성해 넘긴다.
  if (context.format === "json-as-module") {
    const raw = await readFile(new URL(url), "utf8");
    return { format: "module", source: `export default ${raw};`, shortCircuit: true };
  }
  return nextLoad(url, context);
}
