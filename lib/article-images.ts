import type { Article, ArticleImage } from "@/lib/articles";

type ImageGroup =
  | "bathroom"
  | "bedroom"
  | "detail"
  | "kitchen"
  | "living"
  | "organization"
  | "protection"
  | "storage";

type FieldImage = ArticleImage & { group: ImageGroup };

const IMAGE_ROOT = "/images/moving-field";
const IMAGE_REFRESHED_AT = "2026-09-02T08:45:00.000Z";
const CAPTION =
  "실제 이사 현장의 작업 장면입니다. 집 구조와 짐의 종류에 따라 작업 방식은 달라질 수 있습니다.";

const imageGroupMeta: Record<
  ImageGroup,
  { alt: string; title: string }
> = {
  bathroom: {
    alt: "이사 전후 상태를 확인할 수 있는 정리된 욕실 내부",
    title: "욕실 상태 확인",
  },
  bedroom: {
    alt: "침대와 붙박이장 등 침실 가구를 포장하고 정리하는 이사 현장",
    title: "침실 가구 정리",
  },
  detail: {
    alt: "가구와 가전의 세부 상태를 확인하고 안전하게 포장하는 현장",
    title: "가구·가전 확인",
  },
  kitchen: {
    alt: "주방 수납장과 가전 및 식기를 포장하고 정리하는 이사 현장",
    title: "주방 포장·정리",
  },
  living: {
    alt: "거실 가구와 가전을 옮기고 배치하는 포장이사 현장",
    title: "거실 가구 배치",
  },
  organization: {
    alt: "포장이사 작업자가 가구와 수납공간을 정리하는 현장",
    title: "수납·정리 작업",
  },
  protection: {
    alt: "바닥과 가구를 보양한 뒤 이삿짐을 운반하는 현장",
    title: "바닥·가구 보양",
  },
  storage: {
    alt: "책장과 수납가구를 정돈한 이사 현장",
    title: "책장·수납가구",
  },
};

function files(group: ImageGroup, archive: string, numbers: number[]) {
  return numbers.map((number): FieldImage => ({
    group,
    src: `${IMAGE_ROOT}/${group}-${archive}-${number}.webp`,
    alt: imageGroupMeta[group].alt,
    title: imageGroupMeta[group].title,
    caption: CAPTION,
  }));
}

const imageGroups: Record<ImageGroup, FieldImage[]> = {
  bathroom: files("bathroom", "a04", [7]),
  bedroom: [
    ...files("bedroom", "a02", [30, 34, 38]),
    ...files("bedroom", "a03", [25]),
    ...files("bedroom", "a04", [37, 62, 64, 65]),
  ],
  detail: files("detail", "a04", [1]),
  kitchen: [
    ...files("kitchen", "a04", [19, 22, 26]),
  ],
  living: [
    ...files("living", "a03", [10, 12]),
    ...files("living", "a04", [2, 14]),
  ],
  organization: files(
    "organization",
    "a01",
    [2, 8, 9],
  ),
  protection: [
    ...files("protection", "a02", [13]),
    ...files("protection", "a03", [6]),
  ],
  storage: files("storage", "a03", [18, 20]),
};

const allFieldImages = Object.values(imageGroups).flat();

function combineGroups(groups: ImageGroup[]) {
  return groups.flatMap((group) => imageGroups[group]);
}

function getImagePool(article: Article) {
  const text = [
    article.title,
    article.keyword,
    ...(article.secondaryKeywords ?? []),
    article.categoryLabel,
  ].join(" ");

  if (article.category === "regional") return allFieldImages;
  if (/사다리차/.test(text)) {
    return combineGroups(["protection", "living"]);
  }
  if (/입주청소|이사청소|청소/.test(text)) {
    return combineGroups(["bathroom", "kitchen", "protection"]);
  }
  if (/에어컨|TV|티비|설치|수리|인테리어|커튼|블라인드|도배|장판/.test(text)) {
    return combineGroups(["living", "bedroom", "detail", "protection"]);
  }
  if (/폐가전|폐가구|대형폐기물/.test(text)) {
    return combineGroups(["living", "storage", "detail"]);
  }
  if (/준비물|생활용품|이사박스|포장|정리|수납|첫날/.test(text)) {
    return combineGroups(["organization", "storage", "kitchen", "protection"]);
  }
  if (/견적|추가비용|추가요금|원룸|용달|포장이사|엘리베이터/.test(text)) {
    return combineGroups(["protection", "organization", "living"]);
  }
  if (article.category === "admin") {
    return combineGroups(["bedroom", "living", "detail"]);
  }

  return allFieldImages;
}

function asHero(image: FieldImage, article: Article): ArticleImage {
  return {
    ...image,
    title: article.keyword,
  };
}

export function enrichArticlesWithFieldImages(source: Article[]) {
  return source.map((article, articleIndex): Article => {
    const pool = getImagePool(article);
    const hero = pool[articleIndex % pool.length];
    const sectionImage = pool[(articleIndex * 7 + 5) % pool.length];
    const sectionIndex = Math.min(2, Math.max(0, article.sections.length - 1));

    return {
      ...article,
      updatedAt: article.updatedAt > IMAGE_REFRESHED_AT ? article.updatedAt : IMAGE_REFRESHED_AT,
      heroImage: article.heroImage ?? asHero(hero, article),
      sections: article.sections.map((section, index) =>
        index === sectionIndex && !section.image ? { ...section, image: sectionImage } : section,
      ),
    };
  });
}

export const fieldImageCount = allFieldImages.length;
