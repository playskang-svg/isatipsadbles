import data from "@/data/coupang-products.json";

export type CoupangProduct = { title: string; img: string; url: string; topic: string };

const products = data.products as Record<string, CoupangProduct>;

/** 글 하나에 붙는 쿠팡 상품 카드 묶음. after = 이 번호(0부터)의 소제목 뒤, 결론 앞에 놓는다. */
export type CoupangPick = { id: string; reason: string };
export type ArticlePicks = { after: number; items: CoupangPick[] };

const BOX = { id: "box", reason: "책·그릇처럼 무거운 짐은 작은 상자에 나눠 담으면 들기 편해요. 상자 크기는 상세 페이지에서 확인해 보세요." };
const TAPE = { id: "tape", reason: "상자 바닥과 입구를 두 번 감아 두면 이동 중에 열리는 일을 줄일 수 있어요." };
const BUBBLE = { id: "bubble", reason: "유리와 그릇을 감쌀 완충재가 모자란다면 폭과 길이를 먼저 확인해 보세요." };

/**
 * 슬러그별 쿠팡 상품 카드. 상품은 data/coupang-products.json(AF8819972 발급 단축링크)에서 id로 가져온다.
 * 가격·재고는 단정하지 않는다(카드에는 상품명과 고르는 이유만 둔다).
 */
export const articlePicks: Record<string, ArticlePicks> = {
  "window-door-draft-stopper-guide": {
    after: 6,
    items: [{ id: "bubble", reason: "문풍지가 막지 못하는 유리면 냉기는 에어캡이 맡습니다. 내 창 크기에 맞는 폭인지 먼저 확인해 보세요." }],
  },
  "winter-freeze-prevention-water-meter-boiler-guide": {
    after: 0,
    items: [{ id: "bubble", reason: "헌 옷이 부족하면 에어캡을 계량기함 크기에 맞춰 잘라 채우는 방법도 있어요(작성자 제안). 노출된 계량기함이라면 폭과 길이를 확인해 보세요." }],
  },
  "packing-vs-half-packing-moving-difference": {
    after: 1,
    items: [BUBBLE, BOX, TAPE],
  },
  "winter-condensation-mold-prevention-guide": {
    after: 4,
    items: [{ id: "mold-spray", reason: "곰팡이를 닦아낼 제품을 고른다면 사용 방법과 혼합 금지 문구를 상세 페이지 라벨에서 먼저 읽어 보세요." }],
  },
  "window-insulation-film-condensation-guide": {
    after: 4,
    items: [{ id: "bubble", reason: "필름보다 값이 낮고 떼기 쉬운 에어캡부터 써 보고 싶다면 폭과 길이를 확인해 보세요." }],
  },
  "cheonan-seobuk-gu-moving": {
    after: 1,
    items: [BOX, TAPE],
  },
  "cheonan-seobuk-buldang-2-dong-moving": {
    after: 1,
    items: [BOX, TAPE],
  },
};

export function getArticlePicks(slug: string): { after: number; items: (CoupangPick & CoupangProduct)[] } | undefined {
  const picks = articlePicks[slug];
  if (!picks) return undefined;
  const items = picks.items.flatMap((pick) => {
    const product = products[pick.id];
    return product ? [{ ...pick, ...product }] : [];
  });
  return items.length ? { after: picks.after, items } : undefined;
}
