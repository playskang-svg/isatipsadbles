// 쿠팡 파트너스 간편 링크를 검색어별로 만든다. API를 쓰지 않고 관리 화면에 입력한다. 다시 돌리면 이어서 만든다.
// 실행: ego-browser nodejs -e "await import('file:///C:/Window_DEV/github/isatipsadbles/scripts/coupang/issue-links.mjs')"
// 고정 규칙: 쿠팡 링크는 psa****@naver.com(AF8819972)로만 만든다. 계정이 다르면 멈춘다.
// 쿠팡은 웹 요청이 분당 50회를 넘으면 24시간 막고, 3회 쌓이면 이용을 제한한다(2026-11-02에 1회 쌓임). 다른 사이트 발급과 겹칠 수 있어 건당 6초로 돌리고, 제한 응답을 받으면 바로 끝낸다.
const PACE_MS = 6000;
const PARTNER = 'AF8819972';
const fs = await import('node:fs');
const ROOT = 'C:/Window_DEV/github/isatipsadbles/data/';
const OUT = `${ROOT}coupang-links.json`;
const queries = JSON.parse(fs.readFileSync(`${ROOT}coupang-queries.json`, 'utf8'));
const products = {
  'product:보일러 일산화탄소 경보기': 'https://www.coupang.com/vp/products/8397515157?itemId=24272824108&vendorItemId=92008236042',
  'product:수도계량기 동파방지 보온커버': 'https://www.coupang.com/vp/products/8528372850?itemId=20633730058&vendorItemId=87920995300',
  'product:하우스키퍼 단열필름': 'https://www.coupang.com/vp/products/7771726039?itemId=20983052982&vendorItemId=88047815276',
};
const links = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const jobs = [
  ...Object.entries(products).map(([key, url]) => ({ key, url, q: null })),
  ...queries.map((q) => ({ key: q, url: `https://www.coupang.com/np/search?q=${encodeURIComponent(q)}`, q })),
].filter((job) => !links[job.key]);
console.log('남은', jobs.length, '/ 완료', Object.keys(links).length);
const task = await taskSpace('isatips 네이버 키워드·제휴');
const pages = await task.pages();
const page = pages.find((x) => x.label === 'p9') ? task.page('p9') : await task.newPage();
await page.goto('https://partners.coupang.com/#affiliate/ws/link-to-any-page', { timeout: 40000 }).catch((e) => console.log('goto', e.message));
await page.waitForTimeout(3500);
const box = await page.evaluate(() => innerWidth);
await page.mouse.click(box - 47, 34, { label: 'open account menu' });
await page.waitForTimeout(1000);
const who = await page.evaluate(() => document.body.innerText);
await page.mouse.click(box / 2, 400, { label: 'close account menu' });
await page.waitForTimeout(400);
if (!who.includes('psa****@naver.com') || !who.includes(PARTNER)) { console.log('계정 불일치, 중단'); process.exit(0); }
console.log('계정 확인', PARTNER);
await page.evaluate(() => {
  window.__limited = null;
  const O = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () { this.addEventListener('loadend', () => { if (/"rCode":"429"/.test(this.responseText ?? '')) window.__limited = JSON.parse(this.responseText).rMessage; }); return O.apply(this, arguments); };
});
const limited = () => page.evaluate(() => window.__limited);
const read = () => page.evaluate(() => document.body.innerText.match(/https:\/\/link\.coupang\.com\/a\/\w+/)?.[0] ?? null);
const check = async (link, job) => {
  const r = await fetch(link, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0' } });
  const loc = new URL(r.headers.get('location') ?? 'https://x.invalid/');
  if (loc.searchParams.get('lptag') !== PARTNER) return false;
  return job.q ? loc.searchParams.get('q') === job.q : loc.href.includes(new URL(job.url).pathname.split('/').pop());
};
let prev = await read();
let fails = 0;
const started = Date.now();
for (const job of jobs) {
  if (Date.now() - started > 3000000) { console.log('시간 제한, 다시 실행하면 이어집니다'); break; }
  const cycle = Date.now();
  let got = null;
  for (let attempt = 0; attempt < 2 && !got; attempt += 1) {
    const stop = await limited();
    if (stop) { console.log('LIMIT', stop); process.exit(0); }
    await page.evaluate((url) => {
      const i = document.querySelector('input[type=text]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, url);
      i.dispatchEvent(new Event('input', { bubbles: true }));
      i.dispatchEvent(new Event('change', { bubbles: true }));
    }, job.url);
    await page.waitForTimeout(500);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.innerText.trim().startsWith('링크 생성')).click());
    for (let t = 0; t < 24; t += 1) {
      await page.waitForTimeout(250);
      const now = await read();
      if (now && now !== prev) { prev = now; if (await check(now, job)) got = now; else console.log('대조 실패', job.key, now); break; }
    }
    if (!got) await page.waitForTimeout(PACE_MS);
  }
  const stop = await limited();
  if (stop) { console.log('LIMIT', stop); process.exit(0); }
  if (!got) {
    fails += 1;
    console.log('실패', job.key);
    if (fails >= 4) { console.log('연속 실패로 멈춤'); break; }
    continue;
  }
  fails = 0;
  links[job.key] = got;
  fs.writeFileSync(OUT, JSON.stringify(links, null, 1));
  await page.waitForTimeout(Math.max(500, PACE_MS - (Date.now() - cycle)));
}
console.log('완료', Object.keys(links).length, '걸린 초', Math.round((Date.now() - started) / 1000));
