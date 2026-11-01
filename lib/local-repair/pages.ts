import type { Article, Section } from "../articles";
import { linkUrl } from "../affiliate";
import prices from "@/data/soomgo-prices.json";
import priceLinks from "@/data/soomgo-price-links.json";
import plan from "@/data/local-repair-plan.json";
import { doorServices } from "./services/door";
import { extraServices } from "./services/extra";
import { doorWindowServices } from "./services/door-window";
import { finishServices } from "./services/finish";
import { plumbingServices } from "./services/plumbing";
import { kitchenEtcServices } from "./services/kitchen-etc";
import { HERO_CAPTION, heroAlt } from "./heroes";
import type { ServiceModule } from "./types";
import { ageBucket, ageOf, dominantEra, dongBreakdown, dongEntries, ERA_LABELS, getRegion, mainBucket, regions, siblingDongs, statsOf, type City, type DongEntry, type Region } from "./regions";

export const serviceModules: ServiceModule[] = [...doorServices, ...doorWindowServices, ...finishServices, ...plumbingServices, ...kitchenEtcServices, ...extraServices];
const moduleById = new Map(serviceModules.map((item) => [item.id, item]));

type PlanItem = { region: string; service: string; volume: number; posts: number | null; top: string; publishedAt: string };
const planItems = plan.pages as PlanItem[];
const hubDates = plan.hubs as Record<string, string>;
const CHECKED = prices.checked;
const KAPT_SOURCE = { label: "K-apt 공동주택관리정보시스템 단지 정보", url: "https://www.k-apt.go.kr/" };

const priceTable = prices.prices as Record<string, { title: string; min: number; avg: number; max: number; pros: number; requests: number }>;
const priceLinkTable = priceLinks as Record<string, string>;
const CITIES: City[] = ["인천", "천안", "용인", "평택"];
const ACCENTS = ["mint", "amber", "blue", "violet", "rose", "green"];

/** 서비스 전용 이미지가 있으면 그것을, 없으면 모듈 기본 이미지를 쓴다. */
function heroOf(service: ServiceModule, title: string) {
  const alt = heroAlt[service.id];
  return alt
    ? { src: `/images/local-repair/${service.id}.webp`, alt, title, caption: HERO_CAPTION }
    : { src: service.hero.src, alt: service.hero.alt, title };
}

function hasFinal(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
const eun = (word: string) => `${word}${hasFinal(word) ? "은" : "는"}`;
const gwa = (word: string) => `${word}${hasFinal(word) ? "과" : "와"}`;

function stableHash(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** 목록을 start부터 돌려 count개만 고른다. 같은 작업 페이지끼리 내용이 겹치지 않게 한다. */
function pick<T>(list: T[], start: number, count: number): T[] {
  if (list.length <= count) return [...list];
  return Array.from({ length: count }, (_, offset) => list[(start + offset) % list.length]);
}

function won(value: number) {
  const man = Math.round(value / 10000);
  const exact = value % 10000 === 0;
  return `${exact ? "" : "약 "}${man.toLocaleString("ko-KR")}만 원`;
}

export function slugOf(region: Region, service: ServiceModule) {
  return `${region.head} ${service.keyword}`.replace(/\s+/g, "-");
}

const pageIndex = new Map(planItems.map((item) => [`${item.region}|${item.service}`, item]));

function pageHref(label: string, serviceId: string): string | undefined {
  if (!pageIndex.has(`${label}|${serviceId}`)) return undefined;
  const service = moduleById.get(serviceId);
  if (!service) return undefined;
  return `/articles/${slugOf(getRegion(label), service)}`;
}

/** 지역 페이지가 없으면 같은 도시 페이지로 잇는다. 이름도 실제 페이지에 맞춘다. */
function nearestService(region: Pick<Region, "label" | "city">, serviceId: string): { href: string; label: string } | undefined {
  const keyword = moduleById.get(serviceId)?.keyword;
  const own = pageHref(region.label, serviceId);
  if (own) return { href: own, label: `${region.label} ${keyword}` };
  const city = pageHref(region.city, serviceId);
  return city ? { href: city, label: `${region.city} ${keyword}` } : undefined;
}

const cityHubSlug = (city: City) => `${city}-집수리`;
const dongHubSlug = (item: DongEntry) => `${item.city}-${item.dong}-집수리`;

function sourcesFor(service: ServiceModule) {
  const list: { label: string; url: string }[] = [KAPT_SOURCE];
  if (service.priceKey && priceLinkTable[service.priceKey]) {
    list.unshift({ label: `숨고 예상금액: ${priceTable[service.priceKey]?.title ?? service.name}`, url: priceLinkTable[service.priceKey] });
  }
  return list;
}

function priceParagraphs(region: Region, service: ServiceModule): string[] {
  const price = service.priceKey ? priceTable[service.priceKey] : undefined;
  if (!price) {
    return [`${eun(service.name)} 막힌 위치, 방문 시간대, 장비 사용 여부에 따라 금액 차이가 커서 공개된 평균값을 그대로 믿기 어렵습니다. 전화로 묻기 전에 증상 영상을 보내고 출장비와 작업비를 나눠 받으세요.`];
  }
  return [
    `숨고 예상금액 자료(${CHECKED} 확인)에서 ${eun(price.title)} 평균 ${won(price.avg)}, 낮게는 ${won(price.min)}부터 높게는 ${won(price.max)}까지 나옵니다. 활동 고수 ${price.pros.toLocaleString("ko-KR")}명, 누적 견적요청 ${price.requests.toLocaleString("ko-KR")}건이 쌓인 전국 자료입니다.`,
    `${region.label} 고정가격이 아니라 전국에서 거래된 범위입니다. 같은 작업 이름이라도 아래 항목에 따라 금액이 달라지니, 견적서에 이 항목이 어떻게 적혀 있는지 나란히 비교하세요.`,
  ];
}

function localSection(region: Region, service: ServiceModule, form: string): Section {
  const stats = statsOf(region, 8);
  const era = dominantEra(stats);
  const eraCount = Math.max(...stats.eras);
  const main = mainBucket(stats);
  const others = (["old", "mid", "recent"] as const).filter((bucket) => bucket !== main && stats.top.some(([, year]) => ageBucket(year) === bucket));
  const dongs = dongBreakdown(region);
  const newest = stats.top[stats.top.length - 1];
  const oldest = stats.top[0];
  const paragraphs = [
    region.note,
    stats.count > 0
      ? `K-apt에 등록된 ${region.label} 단지 ${stats.count.toLocaleString("ko-KR")}곳을 보면 ${era}에 사용승인된 곳이 ${eraCount.toLocaleString("ko-KR")}곳으로 가장 많습니다.${oldest && newest && oldest[0] !== newest[0] ? ` 표본에서 오래된 쪽은 ${oldest[0]}(${oldest[1]}년), 최근 쪽은 ${newest[0]}(${newest[1]}년)입니다.` : ""}`
      : "",
    service.ageHints[main],
    ...(others[0] ? [service.ageHints[others[0]]] : []),
  ].filter(Boolean);
  const multi = dongs.length >= 4;
  const complexRows = stats.top.map(([name, year]) => [name, `${year}년`, `${ageOf(year)}년 차`]);
  if (multi) {
    paragraphs.push(`단지가 많은 동은 ${dongs.slice(0, 5).map((row) => `${row.dong}(${row.count}곳, ${row.era} 중심)`).join(", ")}입니다. 표본 단지로는 ${stats.top.slice(0, 6).map(([name, year]) => `${name} ${year}년`).join(", ")}이 있습니다.`);
  }
  return {
    heading: `${region.label} ${form}, 우리 집 연식부터 확인하세요`,
    paragraphs,
    ...(multi
      ? {
          table: {
            caption: `${region.label} 동별 K-apt 등록 단지 수. 빌라·단독주택과 소규모 단지는 자료에 없습니다.`,
            head: ["동", "단지 수", "가장 많은 연식"],
            rows: dongs.slice(0, 8).map((row) => [row.dong, `${row.count}곳`, row.era]),
          },
        }
      : complexRows.length >= 3
        ? {
            table: {
              caption: `${region.label} 단지 예시. 연식이 고르게 보이도록 고른 일부이며, 빌라·단독주택과 소규모 단지는 자료에 없습니다.`,
              head: ["단지", "사용승인", "올해 기준"],
              rows: complexRows,
            },
          }
        : {}),
  };
}

function symptomSection(region: Region, service: ServiceModule, form: string, order: number): Section {
  return {
    heading: `${region.label} ${form} 증상별 원인과 조치`,
    paragraphs: ["같은 증상처럼 보여도 원인이 다르면 고치는 곳이 달라집니다. 지금 보이는 증상부터 찾아보세요."],
    table: { head: ["보이는 증상", "흔한 원인", "먼저 할 일"], rows: pick(service.symptoms, order, 3).map((row) => [row.sign, row.cause, row.action]) },
  };
}

function decisionSection(service: ServiceModule, order: number): Section {
  return {
    heading: `${service.name}, 어디까지 고치면 될까`,
    paragraphs: ["돈을 아끼는 쪽과 오래 쓰는 쪽이 다를 때가 있습니다. 상태별로 어느 쪽이 맞는지 나눠 봤습니다."],
    table: { head: ["지금 상태", "권하는 방향", "이유"], rows: pick(service.decisions, order, 3).map((row) => [row.state, row.verdict, row.reason]) },
  };
}

function optionSection(service: ServiceModule): Section {
  return {
    heading: `${service.name} 방법별 차이`,
    paragraphs: ["견적을 받기 전에 어떤 방법이 있는지 알아 두면 업체 설명을 비교하기 쉽습니다."],
    table: { head: ["방법", "맞는 경우", "알아 둘 점"], rows: service.options.map((row) => [row.name, row.when, row.limit]) },
  };
}

function costSection(region: Region, service: ServiceModule, order: number): Section {
  return {
    heading: `${region.head} ${service.keyword} 비용은 얼마나 들까`,
    paragraphs: priceParagraphs(region, service),
    checklist: pick(service.costFactors, order, 3),
  };
}

function selfSection(service: ServiceModule, withBanner: boolean, order: number): Section {
  return {
    heading: `${service.name} 셀프로 할 수 있는 범위`,
    paragraphs: [service.self.scope, ...(service.safety ? [service.safety] : [])],
    steps: service.self.steps,
    materials: pick(service.self.materials, order, 3),
    ...(withBanner ? { coupangBanner: service.id } : {}),
    stopList: service.self.stop,
  };
}

function quoteSection(region: Region, service: ServiceModule, order: number): Section {
  const url = linkUrl(service.quoteKey);
  const stats = statsOf(region, 8);
  const sample = stats.top.length ? stats.top[order % stats.top.length] : undefined;
  const sign = service.symptoms[order % service.symptoms.length].sign.split(/[,·]/)[0];
  const request = `${region.full}${sample ? ` ${sample[0]}, ${sample[1]}년 입주` : ""} 집입니다. ${sign} 상태라 ${service.name} 견적을 받고 싶습니다. 사진 3장 첨부합니다.`;
  return {
    heading: `${region.label} ${service.name} 견적, 사진 3장이면 시작됩니다`,
    paragraphs: [
      `전화로 얼마냐고 물으면 현장을 봐야 안다는 답이 먼저 돌아옵니다. 아래 사진 3장과 건물 조건을 함께 보내면 답이 훨씬 구체적으로 옵니다.`,
      `요청서는 이렇게 쓰면 됩니다. "${request}"`,
      `[숨고에서 ${service.name} 요청서 보내기](${url})로 보내면 조건이 맞는 고수들이 견적을 보냅니다. 받은 견적을 같은 항목으로 나란히 놓고 고르세요.`,
    ],
    checklist: service.photos,
  };
}

function trustSection(region: Region, service: ServiceModule, order: number): Section {
  const related = service.related
    .map((id) => {
      const near = nearestService(region, id);
      return near ? `[${near.label}](${near.href})` : undefined;
    })
    .filter(Boolean)
    .slice(0, 3);
  return {
    heading: `믿고 맡길 곳은 이렇게 고르세요`,
    paragraphs: [
      `가장 싼 곳보다 왜 그 방법을 권하는지 설명하는 곳이 낫습니다. 견적을 받을 때 아래 질문을 그대로 물어보고, 답이 구체적인 곳을 고르세요.`,
      `자주 하는 실수도 있습니다. ${pick(service.mistakes, order, 1).join(" ")}`,
      ...(related.length ? [`같이 살펴보면 좋은 작업은 ${related.join(", ")}입니다.`] : []),
      ...(service.guide ? [`원리부터 더 보고 싶다면 [${service.name} 기본 가이드](/articles/${service.guide})를 함께 읽어 보세요.`] : []),
    ],
    checklist: pick(service.ask, order, 2),
  };
}

function introOf(region: Region, service: ServiceModule, ct: number) {
  const tail = [
    `${region.full} 아파트 연식 자료와 숨고 예상금액을 함께 놓고 ${service.name} 기준을 정리했습니다.`,
    `${region.label}에서 맡기기 전에 어느 쪽이 맞는지 표로 나눠 봤고, 셀프로 할 수 있는 범위도 적었습니다.`,
    `방법마다 맞는 집이 달라 ${region.label} 집 연식과 함께 비교했습니다. 견적 전에 3분만 읽어 보세요.`,
  ][ct];
  return `${service.answers[ct]} ${tail}`;
}

function descriptionOf(region: Region, service: ServiceModule, ct: number) {
  const signs = service.symptoms.slice(0, 2).map((row) => row.sign.split(/[,·]/)[0]).join(", ");
  const action = ["사진 3장으로 견적부터 비교해 보세요.", "사진 3장을 보내면 수리와 교체 견적을 함께 받을 수 있습니다.", "사진 3장만 준비해서 방법별 견적을 받아 보세요."][ct];
  return `${region.head} ${service.keyword} 알아보시나요? ${signs} 같은 증상별 원인, 비용 범위, 셀프 보수 범위를 정리했습니다. ${action}`;
}

function faqOf(region: Region, service: ServiceModule, order: number) {
  const picked = pick(service.faq, order * 2, 3);
  return [
    ...picked.map((item) => ({ question: item.q, answer: item.a })),
    { question: `${region.label}까지 오는 작업자는 어떻게 찾나요?`, answer: `숨고 요청서에 ${region.full}까지 적어 보내면 그 지역에서 활동하는 고수가 견적을 보냅니다. 출장비와 방문 가능 날짜는 고수마다 달라 견적을 받을 때 함께 확인하세요.` },
  ];
}

const serviceOrder = new Map<string, number>();

function makeServicePage(item: PlanItem, index: number): Article {
  const region = getRegion(item.region);
  const service = moduleById.get(item.service);
  if (!service) throw new Error(`[local-repair] 서비스 모듈 없음: ${item.service}`);
  const slug = slugOf(region, service);
  const seed = stableHash(slug);
  // 같은 작업 페이지 안에서 순번대로 돌려 구성이 겹치지 않게 한다.
  const order = serviceOrder.get(service.id) ?? 0;
  serviceOrder.set(service.id, order + 1);
  const ct = order % 3;
  const layout = order % 6;
  const forms = service.keywordForms;
  const form = forms[order % forms.length] ?? service.keyword;
  const form2 = forms[(order + 1) % forms.length] ?? service.keyword;
  const withQuoteBanner = seed % 3 === 0;
  const withCoupangBanner = seed % 2 === 0;

  const local = localSection(region, service, form);
  const symptom = symptomSection(region, service, form2, order);
  const cost = costSection(region, service, order);
  const decision = decisionSection(service, order);
  const option = optionSection(service);
  const self = selfSection(service, withCoupangBanner, order);
  const quote = quoteSection(region, service, order);
  const trust = trustSection(region, service, order);

  const sections = [
    [local, symptom, cost, self, quote, trust],
    [decision, local, cost, quote, self, trust],
    [option, cost, local, self, quote, trust],
    [local, cost, symptom, quote, trust, self],
    [decision, cost, local, self, quote],
    [option, local, cost, quote, self, trust],
  ][layout];

  const url = linkUrl(service.quoteKey);
  const sameService = planItems.filter((other) => other.service === item.service && other.region !== item.region && getRegion(other.region).city === region.city).slice(0, 10);
  const sameRegion = planItems.filter((other) => other.region === item.region && other.service !== item.service).slice(0, 12);

  return {
    slug,
    title: `${region.head} ${service.keyword}, ${service.titleTails[ct]}`,
    description: descriptionOf(region, service, ct),
    category: "regional",
    categoryLabel: "지역별 정보",
    googleNoindex: true,
    keyword: `${region.label} ${service.keyword}`,
    secondaryKeywords: [`${region.label}${service.keyword}`, ...forms.slice(0, 4).map((value) => `${region.label} ${value}`), `${region.city} ${service.keyword}`],
    readingTime: 6,
    publishedAt: item.publishedAt,
    updatedAt: item.publishedAt,
    accent: ACCENTS[index % ACCENTS.length],
    affiliateNotice: true,
    heroImage: heroOf(service, `${region.label} ${service.keyword}`),
    breadcrumbs: [
      { name: "지역별 정보", href: "/category/regional" },
      { name: `${region.city} 집수리`, href: `/articles/${cityHubSlug(region.city)}` },
    ],
    badges: [
      ...(statsOf(region, 1).count ? [`K-apt 단지 ${statsOf(region, 1).count.toLocaleString("ko-KR")}곳 연식 확인`] : []),
      ...(service.priceKey ? [`숨고 예상금액 ${CHECKED} 확인`] : []),
      "시공 업체가 아닌 정보 사이트",
    ],
    intro: introOf(region, service, ct),
    sections,
    faq: faqOf(region, service, order),
    sources: sourcesFor(service),
    relatedSlugs: [
      ...(service.guide ? [service.guide] : []),
      ...service.related.flatMap((id) => {
        const near = nearestService(region, id);
        return near ? [near.href.replace("/articles/", "")] : [];
      }),
    ],
    editorNote: `이사준비백서는 시공 업체가 아니라 집수리 정보를 정리하는 사이트입니다. 금액은 ${CHECKED}에 확인한 숨고 공개 자료이고 단지 정보는 K-apt 자료입니다. 실제 견적과 시공 책임은 계약한 작업자에게 있으니 범위와 금액을 문서로 남기세요.`,
    cta: {
      eyebrow: "숨고 견적 비교",
      title: `${region.label} ${service.name}, 사진 보내고 견적 비교하기`,
      description: `${service.photos.join(", ")}을 요청서에 넣으면 조건이 맞는 고수들이 견적을 보냅니다. 받은 견적은 항목별로 나란히 비교하세요.`,
      buttonLabel: `숨고에서 ${service.name} 견적 받기`,
      url,
    },
    ...(withQuoteBanner ? { quoteBanner: { headline: `${region.label} ${service.name} 견적, 숨고에서 비교하세요`, sub: `사진과 지역을 보내면 조건이 맞는 고수들이 견적을 보냅니다.`, url } } : {}),
    treeAtBottom: true,
    regionTree: {
      title: `${gwa(`${region.label} ${service.name}`)} 이어지는 페이지`,
      description: "가까운 지역의 같은 작업과, 이 지역의 다른 작업을 모았습니다.",
      districts: [
        {
          name: `${region.city} ${service.name}`,
          href: `/articles/${cityHubSlug(region.city)}`,
          dongs: sameService.map((other) => ({ name: `${other.region} ${service.keyword}`, href: `/articles/${slugOf(getRegion(other.region), service)}` })),
        },
        {
          name: `${region.label} 다른 작업`,
          href: `/articles/${cityHubSlug(region.city)}`,
          dongs: sameRegion.map((other) => {
            const otherService = moduleById.get(other.service)!;
            return { name: `${region.label} ${otherService.keyword}`, href: `/articles/${slugOf(region, otherService)}` };
          }),
        },
      ],
    },
  };
}

const HUB_LINE = ["leak", "door", "wallpaper", "doorlock", "screen", "sink", "tile", "sash"];

/** 연식이 오래된 동은 설비·창호, 새 동은 마감·하자 쪽 작업을 먼저 보여 준다. */
const SERVICES_BY_AGE: Record<"old" | "mid" | "recent", string[]> = {
  old: ["leak", "sash", "wallpaper", "faucet", "toiletclog", "door", "sink", "bath"],
  mid: ["door", "film", "wallpaper", "grout", "silicone", "doorlock", "sink", "tile"],
  recent: ["screen", "middle", "film", "grout", "doorlock", "tv", "airconhole", "leak"],
};

const AGE_CHECKS: Record<"old" | "mid" | "recent", { bucket: string; check: string; ids: string[] }> = {
  old: { bucket: "25년 이상", check: "배관과 수도 설비, 창호 틈, 문틀과 경첩이 먼저 약해집니다. 겉 마감보다 안쪽 문제를 먼저 확인하세요.", ids: ["leak", "sash", "frame"] },
  mid: { bucket: "10~25년", check: "필름 들뜸, 실리콘 곰팡이, 줄눈 변색, 도어락 고장이 잦은 시기입니다. 부분 보수로 끝나는 일이 많습니다.", ids: ["film", "silicone", "doorlock"] },
  recent: { bucket: "10년 미만", check: "하자보수 기간과 범위부터 확인하세요. 무상 대상이 아닌 방충망, 중문, 줄눈 같은 추가 시공이 주로 나옵니다.", ids: ["screen", "middle", "grout"] },
};

const HUB_GUIDES = [
  ["진단 이유를 설명하는지, 자재와 철거·폐기 비용을 나눠 적는지 보세요. 답이 구체적인 곳이 대개 일도 깔끔합니다.", "같은 단지에서 일해 본 적이 있는지도 물어보세요. 관리사무소 신고와 승강기 예약 절차를 아는 작업자는 일정이 덜 밀립니다."],
  ["전화보다 사진으로 먼저 물어보면 답의 수준이 바로 드러납니다. 사진만 보고 확정가를 말하는 곳보다 범위와 변수를 짚는 곳을 고르세요.", "작업 뒤 문제가 생기면 언제까지 다시 봐 주는지 문자로 남겨 두세요. 말로만 들은 약속은 나중에 확인할 길이 없습니다."],
  ["견적서에서 작업 범위부터 읽으세요. 금액이 낮아도 철거나 마감이 빠져 있으면 나중에 추가금이 붙습니다.", "시공 전 사진을 직접 찍어 두면 작업 뒤 비교가 쉽고, 전월세라면 퇴거 때도 근거가 됩니다."],
];
const HUB_CHECKS = [
  ["전체 사진 1장, 손상 부위 1장, 건물 입구나 주차 조건 1장", "입주 연도와 전월세 여부", "희망 날짜와 관리사무소 작업 제한 시간"],
  ["동·호수를 뺀 건물 이름과 층수", "승강기와 주차 가능 여부", "언제부터 생긴 문제인지"],
  ["작업할 곳이 한 번에 보이는 사진", "자재를 직접 살지 맡길지", "작업 가능한 요일과 시간"],
];
const HUB_FAQ = [
  { question: "출장은 어디까지 오나요?", answer: "지역명만으로 정해지지 않습니다. 숨고 요청서에 동 이름까지 적어 보내면 그 지역에서 활동하는 고수가 견적을 보내고, 출장비와 날짜는 고수마다 다릅니다." },
  { question: "여러 작업을 한 번에 맡기면 더 싼가요?", answer: "같은 작업자가 처리할 수 있는 공정이면 출장비를 줄일 수 있지만, 공정마다 작업자가 다르면 나눠 맡기는 편이 낫습니다. 묶음 견적과 개별 견적을 함께 받아 비교하세요." },
  { question: "입주 연도를 모르면 어떻게 확인하나요?", answer: "건축물대장이나 관리사무소에서 확인할 수 있고, 단지 이름으로 K-apt에서 사용승인일을 찾아볼 수 있습니다." },
  { question: "하자보수 기간이 남았는지 어떻게 아나요?", answer: "입주자대표회의나 관리사무소에 사용검사일과 공종별 하자담보 기간을 물어보세요. 기간 안이면 유상 수리 전에 먼저 접수하는 편이 낫습니다." },
  { question: "관리사무소에 꼭 알려야 하나요?", answer: "소음이 나는 작업이나 승강기를 쓰는 자재 반입은 신고를 받는 단지가 많습니다. 작업 전에 가능한 시간과 절차를 먼저 확인하세요." },
  { question: "빌라나 단독주택도 같은 기준인가요?", answer: "K-apt에는 빌라와 단독주택이 없어 이 페이지 표에 나오지 않지만 고치는 순서는 같습니다. 다만 관리 주체가 없으면 공용 부분 수리 비용을 누가 낼지 먼저 정해야 합니다." },
];

function makeDongHub(item: DongEntry, index: number): Article {
  const slug = dongHubSlug(item);
  const region: Region = { label: item.dong, head: `${item.city} ${item.dong}`, full: `${item.city} ${item.gu === "평택시" ? "" : `${item.gu} `}${item.dong}`.replace(/\s+/g, " "), city: item.city, keys: [`${item.city}|${item.gu}|${item.dong}`], note: "" };
  const stats = statsOf(region, 12);
  const main = mainBucket(stats);
  const seed = stableHash(slug);
  const ids = pick(SERVICES_BY_AGE[main], seed % 8, 5);
  const era = dominantEra(stats);
  const eraCount = Math.max(...stats.eras);
  const oldCount = stats.eras[0] + stats.eras[1];
  const newCount = stats.eras[4];
  const publishedAt = hubDates[slug] ?? hubDates["*"];
  const siblings = siblingDongs(item.city, item.gu, item.dong).slice(0, 4);
  const oldest = stats.top[0];
  const newest = stats.top[stats.top.length - 1];
  const otherBucket = (["old", "mid", "recent"] as const).filter((bucket) => bucket !== main)[seed % 2];

  const serviceSections: Section[] = ids.map((id, order) => {
    const service = moduleById.get(id)!;
    const near = nearestService(region, id);
    return {
      heading: `${item.dong} ${service.keyword}`,
      paragraphs: [
        service.answers[(seed + order) % 3],
        service.ageHints[main],
        near ? `증상표와 비용 범위는 [${near.label}](${near.href})에서 볼 수 있습니다.` : `[숨고에서 ${service.name} 견적 받기](${linkUrl(service.quoteKey)})로 사진을 보내 먼저 확인해 보세요.`,
      ],
    };
  });

  return {
    slug,
    title: `${item.city} ${item.dong} 집수리, 아파트 연식별 점검과 견적 받는 법`,
    description: `${item.city} ${item.dong} 단지 ${item.entry.n}곳의 연식을 K-apt 자료로 살펴보고 연차별로 먼저 볼 곳, ${ids.slice(0, 3).map((id) => moduleById.get(id)!.keyword).join("·")} 견적 기준을 정리했습니다. 사진 3장으로 견적을 비교해 보세요.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    googleNoindex: true,
    keyword: `${item.dong} 집수리`,
    secondaryKeywords: [`${item.dong} 집수리 업체`, ...ids.map((id) => `${item.dong} ${moduleById.get(id)!.keyword}`), `${item.city} ${item.dong} 수리`],
    readingTime: 5,
    publishedAt,
    updatedAt: publishedAt,
    accent: ACCENTS[index % ACCENTS.length],
    affiliateNotice: true,
    heroImage: heroOf(moduleById.get(ids[0])!, `${item.dong} 집수리`),
    breadcrumbs: [
      { name: "지역별 정보", href: "/category/regional" },
      { name: `${item.city} 집수리`, href: `/articles/${cityHubSlug(item.city)}` },
    ],
    badges: [`K-apt 단지 ${item.entry.n}곳 연식 확인`, "시공 업체가 아닌 정보 사이트"],
    intro: `${region.full} 단지 ${item.entry.n}곳 가운데 ${era}에 사용승인된 곳이 ${eraCount}곳으로 가장 많습니다. 집수리는 지어진 해에 따라 먼저 볼 곳이 달라, ${item.dong}에서 자주 찾는 작업을 연식에 맞춰 묶었습니다.`,
    sections: [
      {
        heading: `${item.dong} 아파트 연식 한눈에 보기`,
        paragraphs: [
          `K-apt에 등록된 ${item.dong} 단지는 ${item.entry.n}곳이고, 2000년 이전 사용승인이 ${oldCount}곳, 2020년 이후가 ${newCount}곳입니다.${oldest && newest && oldest[0] !== newest[0] ? ` 표에서 오래된 쪽은 ${oldest[0]}(${oldest[1]}년), 최근 쪽은 ${newest[0]}(${newest[1]}년)입니다.` : ""}`,
          ...(siblings.length ? [`같은 ${item.gu === "평택시" ? "평택시" : item.gu}에서는 ${siblings.map((row) => `${row.dong} ${row.count}곳`).join(", ")}의 단지가 등록돼 있습니다. 빌라와 단독주택, 소규모 단지는 이 자료에 없으니 입주 연도를 직접 확인하세요.`] : []),
        ],
        table: { caption: "연식이 고르게 보이도록 고른 일부 단지입니다.", head: ["단지", "사용승인", "올해 기준"], rows: stats.top.map(([name, year]) => [name, `${year}년`, `${ageOf(year)}년 차`]) },
      },
      {
        heading: `${item.dong} 집이라면 먼저 볼 곳`,
        paragraphs: [`${item.dong}은 ${era} 단지가 많아 아래 첫 줄이 먼저 해당될 가능성이 큽니다. 우리 집 입주 연도를 보고 맞는 줄을 고르세요.`],
        table: { head: ["준공 후", "먼저 볼 곳", "관련 작업"], rows: [main, otherBucket].map((bucket) => { const row = AGE_CHECKS[bucket]; return [row.bucket, row.check, row.ids.map((id) => moduleById.get(id)!.keyword).join(", ")]; }) },
      },
      ...serviceSections,
      {
        heading: `${item.dong}에서 작업자 고르는 기준`,
        paragraphs: HUB_GUIDES[seed % HUB_GUIDES.length],
        checklist: HUB_CHECKS[(seed >> 3) % HUB_CHECKS.length],
      },
    ],
    faq: [
      ...pick(HUB_FAQ, seed % HUB_FAQ.length, 3),
      { question: `${item.dong} 집수리 비용은 어디서 확인하나요?`, answer: `${item.dong}만의 고정가격은 없습니다. 작업별 숨고 예상금액은 ${item.city} 작업 페이지에서 볼 수 있고, 실제 금액은 사진을 보낸 뒤 받는 견적으로 비교하세요.` },
    ],
    sources: [KAPT_SOURCE],
    relatedSlugs: ids.flatMap((id) => {
      const near = nearestService(region, id);
      return near ? [near.href.replace("/articles/", "")] : [];
    }),
    editorNote: `이사준비백서는 시공 업체가 아니라 집수리 정보를 정리하는 사이트입니다. 단지 정보는 ${CHECKED}에 확인한 K-apt 자료입니다. 실제 견적과 시공 책임은 계약한 작업자에게 있습니다.`,
    cta: {
      eyebrow: "숨고 견적 비교",
      title: `${item.dong} 집수리, 사진 보내고 견적 받기`,
      description: "작업 종류를 고르고 사진과 동 이름을 적으면 조건이 맞는 고수들이 견적을 보냅니다.",
      buttonLabel: `숨고에서 ${moduleById.get(ids[0])!.name} 견적 받기`,
      url: linkUrl(moduleById.get(ids[0])!.quoteKey),
    },
    treeAtBottom: true,
    regionTree: {
      title: `${item.city} 집수리 이어 보기`,
      description: "같은 도시의 작업별 페이지입니다.",
      districts: [
        {
          name: `${item.city} 작업별`,
          href: `/articles/${cityHubSlug(item.city)}`,
          dongs: HUB_LINE.flatMap((id) => {
            const href = pageHref(item.city, id);
            return href ? [{ name: `${item.city} ${moduleById.get(id)!.keyword}`, href }] : [];
          }),
        },
      ],
    },
  };
}

function makeCityHub(city: City, index: number): Article {
  const region = getRegion(city);
  const slug = cityHubSlug(city);
  const stats = statsOf(region, 8);
  const gus = [...new Set(dongEntries.filter((item) => item.city === city).map((item) => item.gu))];
  const quotes = [["repair-soomgo-leak", "누수"], ["repair-soomgo-door-repair", "문 수리"], ["repair-soomgo-wallpaper", "도배"], ["repair-soomgo-doorlock", "도어락"], ["repair-soomgo-screen-door", "방충망"]];
  const servicesHere = planItems.filter((item) => item.region === city);
  const publishedAt = hubDates[slug] ?? hubDates["*"];
  return {
    slug,
    title: `${city} 집수리, 구·동별 문수리·도배·누수 견적 확인`,
    description: `${region.full} 집수리를 동네와 작업별로 찾아보세요. K-apt 단지 ${stats.count.toLocaleString("ko-KR")}곳의 연식 자료와 숨고 예상금액, 셀프 보수 범위를 함께 정리했습니다. 사진 3장으로 견적을 비교해 보세요.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    keyword: `${city} 집수리`,
    secondaryKeywords: [`${city}집수리`, `${city} 집수리 업체`, `${city} 인테리어 수리`, `${city} 하자보수`, `${city} 원상복구`],
    readingTime: 5,
    publishedAt,
    updatedAt: publishedAt,
    accent: ACCENTS[index % ACCENTS.length],
    affiliateNotice: true,
    heroImage: { src: "/images/repair-install/home-repair-inspection.webp", alt: "문, 싱크대, 샷시 등 설치·수리 현장을 점검하는 작업자", title: `${city} 집수리` },
    breadcrumbs: [{ name: "지역별 정보", href: "/category/regional" }],
    badges: [`K-apt 단지 ${stats.count.toLocaleString("ko-KR")}곳 연식 확인`, `숨고 예상금액 ${CHECKED} 확인`, "시공 업체가 아닌 정보 사이트"],
    intro: `${region.note} 동네와 작업을 고르면 증상표, 숨고 예상금액, 셀프로 할 수 있는 범위까지 한 페이지에서 볼 수 있습니다.`,
    sections: [
      {
        heading: `${city} 아파트는 언제 지어졌을까`,
        paragraphs: [`K-apt에 등록된 ${city} 단지는 ${stats.count.toLocaleString("ko-KR")}곳입니다. 연식에 따라 먼저 고장 나는 곳이 달라, 집수리 비용을 따지기 전에 입주 연도부터 확인하는 편이 좋습니다.`],
        table: { head: ["사용승인 시기", "단지 수"], rows: ERA_LABELS.map((label, order) => [label, `${stats.eras[order].toLocaleString("ko-KR")}곳`]) },
      },
      {
        heading: `${city} 집수리, 자주 찾는 작업`,
        paragraphs: [
          "지금 필요한 작업을 고르세요. 이름을 누르면 증상별 원인과 비용 범위를 볼 수 있습니다.",
          servicesHere.slice(0, 18).map((item) => { const service = moduleById.get(item.service)!; return `[${city} ${service.keyword}](/articles/${slugOf(region, service)})`; }).join(" · "),
        ],
      },
      {
        heading: "작업별 숨고 예상금액",
        paragraphs: [`아래는 ${CHECKED}에 확인한 숨고 공개 자료입니다. 전국에서 거래된 범위라 ${city} 고정가격은 아닙니다.`],
        table: {
          head: ["작업", "평균", "범위"],
          rows: ["문-설치-수리", "도배-시공", "누수-탐지", "열쇠-도어락-설치-수리", "방충망-설치-수리", "타일-시공", "싱크대-교체", "수도-설치-수리"].flatMap((key) => {
            const price = priceTable[key];
            return price ? [[price.title, won(price.avg), `${won(price.min)} ~ ${won(price.max)}`]] : [];
          }),
        },
      },
      {
        heading: "견적 비교는 이 순서로 하세요",
        paragraphs: [
          "먼저 손상 부위와 전체 모습을 사진으로 남기세요. 그다음 입주 연도, 전월세 여부, 주차와 승강기 조건을 적으면 작업자가 범위를 빠르게 잡습니다.",
          `작업을 정했다면 ${quotes.map(([key, label]) => `[숨고 ${label} 견적](${linkUrl(key)})`).join(", ")}처럼 작업에 맞는 요청서를 보내세요.`,
        ],
        checklist: ["전체 사진과 손상 부위 사진", "입주 연도와 전월세 여부", "주차·승강기·작업 가능 시간", "희망 날짜"],
      },
    ],
    faq: [
      { question: `${city}에서 집수리 업체는 어떻게 고르나요?`, answer: "사진을 같은 조건으로 여러 곳에 보내 답을 비교하세요. 왜 그 방법을 권하는지 설명하고, 자재와 철거 비용을 나눠 적는 곳이 비교하기 쉽습니다." },
      { question: "작은 수리도 불러도 되나요?", answer: "문 한 짝, 수전 하나 같은 작은 작업도 맡는 작업자가 많습니다. 다만 출장비가 작업비에 묻어 있는 경우가 있으니 함께 물어보세요." },
      { question: "전월세 집은 누가 고쳐야 하나요?", answer: "손상 원인과 계약 내용에 따라 달라집니다. 찾기 쉬운 생활법령정보의 임대차 안내와 계약서를 확인하고 집주인과 먼저 이야기하세요." },
    ],
    sources: [KAPT_SOURCE],
    editorNote: `이사준비백서는 시공 업체가 아니라 집수리 정보를 정리하는 사이트입니다. 금액과 단지 정보는 ${CHECKED}에 확인한 공개 자료이며 실제 견적과 다를 수 있습니다.`,
    cta: {
      eyebrow: "숨고 견적 비교",
      title: `${city} 집수리, 사진 보내고 견적 받기`,
      description: "작업을 고르고 사진과 동 이름을 적으면 조건이 맞는 고수들이 견적을 보냅니다.",
      buttonLabel: "숨고에서 문 수리 견적 받기",
      url: linkUrl("repair-soomgo-door-repair"),
    },
    regionTree: {
      title: `${city} 동네별 집수리`,
      description: "동네 이름을 누르면 그 동네 아파트 연식과 자주 찾는 작업을 볼 수 있습니다.",
      districts: gus.map((gu) => ({
        name: gu === "평택시" ? "평택시" : `${city} ${gu}`,
        href: `/articles/${slug}`,
        dongs: dongEntries.filter((item) => item.city === city && item.gu === gu).map((item) => ({ name: item.dong, href: `/articles/${dongHubSlug(item)}` })),
      })),
    },
  };
}

const servicePages = planItems.map(makeServicePage);
const dongHubs = dongEntries.map(makeDongHub);
const cityHubs = CITIES.map(makeCityHub);

export const localRepairArticles: Article[] = [...cityHubs, ...servicePages, ...dongHubs];

const seen = new Set<string>();
for (const article of localRepairArticles) {
  if (seen.has(article.slug)) throw new Error(`[local-repair] 중복 슬러그: ${article.slug}`);
  seen.add(article.slug);
}

export type LocalRepairIndexGroup = { city: City; items: { label: string; href: string; publishedAt: string }[] };

export const localRepairIndex: LocalRepairIndexGroup[] = CITIES.map((city) => ({
  city,
  items: [
    { label: `${city} 집수리`, href: `/articles/${cityHubSlug(city)}`, publishedAt: cityHubs[CITIES.indexOf(city)].publishedAt },
    ...servicePages.filter((page, index) => getRegion(planItems[index].region).city === city).map((page) => ({ label: page.keyword, href: `/articles/${page.slug}`, publishedAt: page.publishedAt })),
    ...dongHubs.filter((page) => page.slug.startsWith(`${city}-`)).map((page) => ({ label: page.keyword, href: `/articles/${page.slug}`, publishedAt: page.publishedAt })),
  ],
}));

export { regions, CITIES };
