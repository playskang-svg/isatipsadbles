// 두 글이 얼마나 겹치는지 재는 공용 도구.
//
// 앞서 쓴 글과 얼마나 닮았는지 잰다.
// 문장이 아니라 글자 4-gram으로 재기 때문에 어순만 바꾼 재탕도 걸린다.

export function shingles(text, size = 4) {
  const normalized = String(text).replace(/https?:\/\/[^\s]+/gu, " ").replace(/[^가-힣a-z0-9]+/giu, "");
  const set = new Set();
  for (let i = 0; i <= normalized.length - size; i += 1) set.add(normalized.slice(i, i + size));
  return set;
}

export function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const gram of a) if (b.has(gram)) shared += 1;
  return shared / (a.size + b.size - shared);
}
